const ical = require('node-ical');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fetchRoomsWithIcal() {
  const { data, error } = await supabase.from('rooms').select('id, external_ical_urls');
  if (error) throw error;
  return (data || []).filter(r => Array.isArray(r.external_ical_urls) && r.external_ical_urls.length > 0);
}

async function fetchExistingBlocks(roomId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('check_in, check_out')
    .contains('room_ids', [roomId])
    .eq('status', 'blocked');
  if (error) throw error;
  return data || [];
}

async function insertBlock(roomId, start, end) {
  await supabase.from('bookings').insert([
    {
      room_ids: [roomId],
      is_whole_property: false,
      check_in: start,
      check_out: end,
      guests: 1,
      guest_info: { firstName: 'External', lastName: 'Block' },
      add_ons: [],
      base_price: 0,
      total_price: 0,
      status: 'blocked',
      payment_status: 'n/a',
      source: 'ical-import',
    },
  ]);
}

async function syncRoom(room) {
  for (const url of room.external_ical_urls) {
    try {
      const events = await ical.async.fromURL(url);
      const existingBlocks = await fetchExistingBlocks(room.id);
      for (const key in events) {
        const ev = events[key];
        if (ev.type === 'VEVENT' && ev.start && ev.end) {
          const start = ev.start.toISOString().slice(0, 10);
          const end = ev.end.toISOString().slice(0, 10);
          // Only insert if not already blocked
          const alreadyBlocked = existingBlocks.some(b => b.check_in === start && b.check_out === end);
          if (!alreadyBlocked) {
            await insertBlock(room.id, start, end);
            console.log(`Blocked ${start} to ${end} for room ${room.id}`);
          }
        }
      }
    } catch (err) {
      console.error(`Failed to sync iCal for room ${room.id}:`, err);
    }
  }
}

async function cleanupOldBlocks() {
  const today = new Date().toISOString().slice(0, 10);
  await supabase.from('bookings').delete().match({ status: 'blocked' }).lt('check_out', today);
  console.log('Old blocked bookings cleaned up.');
}

async function main() {
  await cleanupOldBlocks();
  const rooms = await fetchRoomsWithIcal();
  for (const room of rooms) {
    await syncRoom(room);
  }
  console.log('iCal sync complete.');
}

main().catch(console.error); 