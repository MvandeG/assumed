import { t } from '../copy/en';
import { downloadFile } from './download';

const pad = (n: number) => String(n).padStart(2, '0');

function utcStamp(d: Date) {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** A daily recurring event at local time "HH:MM" with an alert at the start. */
export function buildIcs(time: string, now = new Date()): string {
  const [h, m] = time.split(':').map(Number);
  // Floating local time, so the calendar app keeps it at the same clock time everywhere.
  const start = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(h)}${pad(m)}00`;
  const uid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}@assumed.app`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Assumed//Bedtime reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${start}`,
    'DURATION:PT15M',
    'RRULE:FREQ=DAILY',
    `SUMMARY:${t.calendar.summary}`,
    `DESCRIPTION:${t.calendar.description}`,
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${t.calendar.description}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function downloadReminder(time: string) {
  downloadFile(buildIcs(time), t.calendar.filename, 'text/calendar;charset=utf-8');
}
