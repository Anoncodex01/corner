import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
  const { roomId } = params;

  // Minimal iCal data for demonstration
  const icalData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//YourApp//EN\nBEGIN:VEVENT\nSUMMARY:Sample Event for Room ${roomId}\nDTSTART:20240101T120000Z\nDTEND:20240101T130000Z\nEND:VEVENT\nEND:VCALENDAR`;

  return new Response(icalData, {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename=\"room-${roomId}.ics\"`,
    },
  });
} 