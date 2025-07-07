import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST() {
  return new Promise((resolve) => {
    exec('node scripts/sync-external-ical.js', (error, stdout, stderr) => {
      if (error) {
        console.error('iCal sync error:', error, stderr);
        // Optionally, send email/notification here
        resolve(NextResponse.json({ success: false, error: stderr }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ success: true, output: stdout }));
      }
    });
  });
} 