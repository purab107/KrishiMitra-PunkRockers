export async function checkRainForRange(fromDate, toDate, opts = {}) {
  // Best-effort: call backend forecast endpoint and scan daily/hourly entries
  // opts: { locationQuery }
  const q = opts.locationQuery || 'Raipur,IN';
  const url = `http://localhost:5000/api/forecast?q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    // Try daily then hourly
    const days = json.daily || json.list || null;
    const fromTs = new Date(fromDate).setHours(0,0,0,0);
    const toTs = new Date(toDate).setHours(23,59,59,999);
    let rainFound = false;
    let details = [];
    if (Array.isArray(json.daily)) {
      for (const d of json.daily) {
        // d.dt may be unix timestamp (seconds)
        const dt = d.dt ? (d.dt * 1000) : null;
        if (!dt) continue;
        if (dt >= fromTs && dt <= toTs) {
          const pop = d.pop ?? 0; // probability of precipitation
          const rain = d.rain ?? 0;
          details.push({ dt, pop, rain });
          if ((pop && pop >= 0.5) || (rain && rain > 0)) rainFound = true;
        }
      }
    } else if (Array.isArray(json.list)) {
      for (const item of json.list) {
        const dt = item.dt ? (item.dt * 1000) : null;
        if (!dt) continue;
        if (dt >= fromTs && dt <= toTs) {
          const pop = item.pop ?? 0;
          const rain = (item.rain && (item.rain['3h'] || item.rain)) || 0;
          details.push({ dt, pop, rain });
          if ((pop && pop >= 0.5) || (rain && rain > 0)) rainFound = true;
        }
      }
    } else if (json.rain || json.current) {
      // fallback: check current
      const currentPop = json.current && json.current.pop ? json.current.pop : 0;
      const currentRain = json.current && json.current.rain ? json.current.rain['1h'] || json.current.rain : 0;
      if ((currentPop && currentPop >= 0.5) || (currentRain && currentRain > 0)) {
        rainFound = true;
        details.push({ now: true, pop: currentPop, rain: currentRain });
      }
    }
    return { postpone: rainFound, details };
  } catch (err) {
    console.warn('checkRainForRange error', err);
    return { postpone: false, details: null, error: String(err) };
  }
}
