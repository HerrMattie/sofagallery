import { NextResponse } from 'next/server';

// Helper: map Airtable records to our UI model
function mapRecord(r, fields) {
  const f = r.fields || {};
  const get = (k, d='') => f[process.env['FIELD_' + k] || fields[k]] ?? d;
  const any = (x) => Array.isArray(x) ? (x[0] || '') : x;

  return {
    id: r.id,
    title: get('TITLE', 'Onbekend'),
    artist: get('ARTIST', ''),
    year: get('YEAR', ''),
    theme: get('THEME', ''),
    audio_text: get('AUDIO', ''),
    image_url: any(get('IMAGE_URL', '')),
    source: get('SOURCE', 'Airtable')
  };
}

/**
 * GET /api/artworks
 * Returns items from Airtable if env vars are present; otherwise returns demo data.
 *
 * Required env for Airtable mode:
 * - AIRTABLE_TOKEN
 * - AIRTABLE_BASE_ID
 * - AIRTABLE_TABLE (e.g., 'Artworks')
 *
 * Optional env to override field names:
 * - FIELD_TITLE, FIELD_ARTIST, FIELD_YEAR, FIELD_THEME, FIELD_AUDIO, FIELD_IMAGE_URL, FIELD_SOURCE
 */
export async function GET() {
  const hasAirtable = !!(process.env.AIRTABLE_TOKEN && process.env.AIRTABLE_BASE_ID && process.env.AIRTABLE_TABLE);

  if (!hasAirtable) {
    // Demo items so the app works out of the box
    const items = [
      {
        id: 'demo1',
        title: "Een pelikaan en ander gevogelte bij een waterbassin (‘Het drijvend veertje’)",
        artist: "Melchior d'Hondecoeter",
        year: "ca. 1680",
        theme: "Hollandse meesters",
        audio_text: "Stel je voor: de hofelijke stilte wordt onderbroken door het zacht rimpelen van water...",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Melchior_d%27Hondecoeter_-_Een_pelikaan_en_andere_vogels.jpg",
        source: "Demo"
      }
    ];
    return NextResponse.json({ mode: 'demo', items });
  }

  try {
    const headers = {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    };
    const table = process.env.AIRTABLE_TABLE;
    const baseId = process.env.AIRTABLE_BASE_ID;

    // Default field names (can be overridden by FIELD_* envs)
    const fields = {
      TITLE: 'Title',
      ARTIST: 'Artist',
      YEAR: 'Year',
      THEME: 'Theme',
      AUDIO: 'AudioText',
      IMAGE_URL: 'ImageURL',
      SOURCE: 'Source'
    };

    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`);
    // Sort by Title asc as default
    url.searchParams.set('sort[0][field]', process.env.SORT_FIELD || (process.env.FIELD_TITLE || fields.TITLE));
    url.searchParams.set('sort[0][direction]', 'asc');
    // Only fetch needed fields (optional)
    const selectFields = [
      process.env.FIELD_TITLE || fields.TITLE,
      process.env.FIELD_ARTIST || fields.ARTIST,
      process.env.FIELD_YEAR || fields.YEAR,
      process.env.FIELD_THEME || fields.THEME,
      process.env.FIELD_AUDIO || fields.AUDIO,
      process.env.FIELD_IMAGE_URL || fields.IMAGE_URL,
      process.env.FIELD_SOURCE || fields.SOURCE
    ];
    selectFields.forEach((f, i) => url.searchParams.set(`fields[${i}]`, f));

    const res = await fetch(url.toString(), { headers, cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Airtable error', detail: text }, { status: 500 });
    }
    const json = await res.json();
    const items = (json.records || []).map(r => mapRecord(r, fields));

    return NextResponse.json({ mode: 'airtable', items });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
