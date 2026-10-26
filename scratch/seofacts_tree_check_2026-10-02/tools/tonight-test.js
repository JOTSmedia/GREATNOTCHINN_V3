// Tonight's-act card + NY "business night" test (mocked clock + mocked Google Calendar API).
// Usage: serve the repo root (e.g. `npx http-server .. -p 18790`), then from tools/:
//   npm i playwright && npx playwright install chromium
//   BASE=http://127.0.0.1:18790/ OUT=./tonight-shots/ node tonight-test.js
// Exit code 1 if any case fails. Case 8 uses the real calendar (needs network).
const { chromium } = require('playwright');
require('fs').mkdirSync(process.env.OUT || './tonight-shots/', { recursive: true });
const URL=process.env.BASE||'http://127.0.0.1:18790/', OUT=(process.env.OUT||'./tonight-shots/').replace(/\/?$/,'/');
const ev=(id,summary,start,end,allDay)=>allDay?{id,summary,start:{date:start},end:{date:end}}:{id,summary,start:{dateTime:start},end:{dateTime:end}};
const CASES=[
 {name:'1-event-today', desc:'Tue 9 PM NY, timed act + all-day "Open 5pm to 2am"', now:'2026-09-30T01:00:00Z', tz:'America/New_York',
  items:[ev('a','Open 5pm to 2am','2026-09-29','2026-09-30',true),ev('b','Wild Bill & The Flying Sparks','2026-09-29T20:00:00-04:00','2026-09-30T00:00:00-04:00'),ev('c','Uptown Boogie','2026-09-30T20:00:00-04:00','2026-10-01T00:00:00-04:00')],
  expect:{state:'event',text:'Wild Bill & The Flying Sparks'}, expectRows:['[T] Tue, Sep 29Wild Bill & The Flying SparksLIVE TONIGHT8:00 PM'], forbidRows:['Open 5pm']},
 {name:'1b-all-day-hours-only', desc:'Tue 9 PM NY, only all-day "Open 5pm to 2am" hours entries', now:'2026-09-30T01:00:00Z', tz:'America/New_York',
  items:[ev('h','Open 5pm to 2am','2026-09-29','2026-09-30',true),ev('h2','Open 5pm to 2am','2026-09-30','2026-10-01',true)],
  expect:{state:'fallback',text:'Live music tonight'}, forbidRows:['Open 5pm']},
 {name:'2-no-event', desc:'Wed 7 PM NY, events only on other nights', now:'2026-09-30T23:00:00Z', tz:'America/New_York',
  items:[ev('b','Wild Bill & The Flying Sparks','2026-09-29T20:00:00-04:00','2026-09-30T00:00:00-04:00'),ev('d','Paddy Lou','2026-10-02T21:00:00-04:00','2026-10-03T01:00:00-04:00')],
  expect:{state:'fallback',text:'Live music tonight'}},
 {name:'3-fetch-error', desc:'Tue 9 PM NY, Calendar API returns 500', now:'2026-09-30T01:00:00Z', tz:'America/New_York', error:true,
  expect:{state:'fallback',text:'Live music tonight'}},
 {name:'4-1am-monday-ny', desc:'1:00 AM Monday NY, Sunday 8 PM event', now:'2026-09-28T05:00:00Z', tz:'America/New_York',
  items:[ev('s','Sunday Jam with The Kootz','2026-09-27T20:00:00-04:00','2026-09-28T00:00:00-04:00')],
  expect:{state:'event',text:'Sunday Jam with The Kootz'}, expectTodayRow:'Kootz'},
 {name:'5-3pm-monday', desc:'3:00 PM Monday NY (closed), Sunday event present', now:'2026-09-28T19:00:00Z', tz:'America/New_York',
  items:[ev('s','Sunday Jam with The Kootz','2026-09-27T20:00:00-04:00','2026-09-28T00:00:00-04:00')],
  expect:{state:'closed',text:'Closed Mondays · Open Tue–Sun from 5 PM'}},
 {expectRows:['[T] Sun, Sep 27Sunday Jam with The KootzLIVE TONIGHT8:00 PM'], name:'6-la-visitor-10pm-sun', desc:'Visitor in America/Los_Angeles, 10 PM PT Sunday = 1 AM Mon NY', now:'2026-09-28T05:00:00Z', tz:'America/Los_Angeles',
  items:[ev('s','Sunday Jam with The Kootz','2026-09-27T20:00:00-04:00','2026-09-28T00:00:00-04:00')],
  expect:{state:'event',text:'Sunday Jam with The Kootz'}, expectTodayRow:'Kootz'},
 {name:'7-escaping', desc:'Tue 9 PM NY, title containing HTML', now:'2026-09-30T01:00:00Z', tz:'America/New_York', noShot:true,
  items:[ev('x','<img src=x onerror="window.__xss=1"><b>Nitro</b> Blues','2026-09-29T20:00:00-04:00','2026-09-30T00:00:00-04:00')],
  expect:{state:'event',text:'<img src=x onerror="window.__xss=1"><b>Nitro</b> Blues'}},
 {name:'8-live', desc:'Real clock + real Google Calendar (no mocks)', live:true, tz:'America/New_York'},
];
(async()=>{
 const b=await chromium.launch({args:['--disable-dev-shm-usage','--disable-gpu']}); const results=[];
 for (const C of CASES.filter(c=>!process.env.ONLY||process.env.ONLY.split(',').includes(c.name))) for (const [w,vp,mob] of [['desktop',{width:1440,height:900},false],['mobile',{width:390,height:844},true]]) {
  for (let attempt=1; attempt<=3; attempt++) { try {
  const ctx=await b.newContext({viewport:vp,isMobile:mob,hasTouch:mob,timezoneId:C.tz});
  const p=await ctx.newPage(); p.setDefaultTimeout(120000); const errs=[]; const futureMins=[], pastMins=[];
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120))});
  if(!C.live){
    await p.clock.setFixedTime(new Date(C.now));
    await p.route('**/calendar/v3/calendars/**', r=> C.error ? r.fulfill({status:500,body:'{}'}) : (()=>{ const u=new (require('url').URL)(r.request().url()); const tmin=u.searchParams.get('timeMin'), tmax=u.searchParams.get('timeMax');
      const t=x=>new Date(x.dateTime||x.date+'T00:00:00-04:00').getTime();
      const items=C.items.filter(e=>(!tmin||t(e.end)>new Date(tmin).getTime())&&(!tmax||t(e.start)<new Date(tmax).getTime()));
      (tmax?pastMins:futureMins).push(tmin); return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({items})}); })());
  }
  await p.addInitScript(()=>{if(window.top!==window)return;window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});
    document.addEventListener('DOMContentLoaded',()=>{const c=document.getElementById('tonightCard');window.__first={text:document.getElementById('tonightAct').textContent,h:c.getBoundingClientRect().height};},{once:true});});
  await p.goto(URL,{waitUntil:'networkidle',timeout:180000}); await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{const c=document.getElementById('tonightCard'),a=document.getElementById('tonightAct');
    return {text:a.textContent,state:c.dataset.state,h:c.getBoundingClientRect().height,first:window.__first,childEls:a.children.length,xss:!!window.__xss,
      nyNow:new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'numeric',minute:'2-digit'}).format(new Date()),
      localNow:new Date().toString().slice(0,24)+' '+Intl.DateTimeFormat().resolvedOptions().timeZone,cls:window.__cls,pastRows:[...document.querySelectorAll('#past tbody tr')].map(t=>t.textContent.replace(/\s+/g,' ').slice(0,70)),allRows:[...document.querySelectorAll('#future tbody tr')].map(t=>(t.classList.contains('today')?'[T] ':'')+t.textContent.replace(/\s+/g,' ').slice(0,70)),todayRows:[...document.querySelectorAll('#future tbody tr.today')].map(t=>t.textContent.replace(/\s+/g,' ').slice(0,80))}});
  let pass = C.expect ? (r.text===C.expect.text && r.state===C.expect.state) : true;
  pass = pass && r.childEls===0 && !r.xss && Math.abs(r.first.h-r.h)<0.5;
  if(!C.noShot){ const card=await p.$('#tonightCard'); await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    await card.screenshot({path:`${OUT}${C.name}-${w}-card.png`});
    if(C.name.startsWith('4-')) { await p.$eval('#links',e=>e.scrollIntoView()); await p.waitForTimeout(500); await p.screenshot({path:`${OUT}${C.name}-${w}-section.png`}); } }
  if(C.expectRows) pass = pass && C.expectRows.every(x=>r.allRows.some(t=>t.includes(x)));
  if(C.forbidRows) pass = pass && !C.forbidRows.some(x=>r.allRows.concat(r.pastRows).some(t=>t.includes(x)));
  if(C.expectTodayRow) pass = pass && r.todayRows.some(t=>t.includes(C.expectTodayRow));
  results.push({case:C.name,w,pass,allRows:r.allRows,futureTimeMin:futureMins[0],todayRows:r.todayRows,cls:r.cls,expect:C.expect&&C.expect.text,got:r.text,state:r.state,firstPaint:r.first.text,heightFirst:r.first.h,heightFinal:r.h,nyNow:r.nyNow,localNow:r.localNow,errs});
  await ctx.close(); break;
  } catch (err) { console.error(`${C.name} ${w} attempt ${attempt} failed: ${String(err.message).split('\n')[0]}`); if (attempt===3) results.push({case:C.name,w,pass:false,error:String(err.message).split('\n')[0]}); }
  }
 }
 console.log(JSON.stringify(results,null,1)); await b.close();
 const failed=results.filter(r=>!r.pass); console.error(`${results.length-failed.length}/${results.length} pass`); process.exit(failed.length?1:0);
})();
