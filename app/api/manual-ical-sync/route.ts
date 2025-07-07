import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const { stdout } = await execAsync('node scripts/sync-external-ical.js');
    return NextResponse.json({ success: true, output: stdout });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.stderr || error.message }, { status: 500 });
  }
} 