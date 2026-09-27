@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');

:root{
  --primary:#4A0E1F;
  --primary-dark:#270710;
  --rose:#D689A4;
  --blush:#F7D7DD;
  --cream:#FFF8EF;
  --cream-2:#F6E9E5;
  --charcoal:#1F1F1F;
  --muted:#79656B;
  --gold:#D4AF7C;
  --line:rgba(74,14,31,.12);
  --white:#fff;
}

*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:"DM Sans",sans-serif;color:var(--charcoal);background:var(--cream);
  line-height:1.6;overflow-x:hidden;
}
a{text-decoration:none;color:inherit}
button{font:inherit}

.site-header{
  width:min(1180px,calc(100% - 40px));margin:18px auto;padding:10px 18px;
  border:1px solid var(--line);border-radius:999px;background:rgba(255,248,239,.9);
  backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:12px;z-index:20;box-shadow:0 8px 30px rgba(74,14,31,.04)
}
.brand-logo{width:126px;display:block}
.step-indicator{display:flex;align-items:center;gap:10px;color:#b9a6aa;font-size:9px;letter-spacing:.12em}
.step-indicator span{
  width:25px;height:25px;border:1px solid var(--line);border-radius:50%;
  display:grid;place-items:center
}
.step-indicator .active{background:var(--primary);border-color:var(--primary);color:white}
.step-indicator i{width:28px;height:1px;background:var(--line)}
.back-link{font-size:11px;font-weight:600;color:var(--muted)}

.template-hero{
  width:min(900px,calc(100% - 40px));margin:105px auto 0;text-align:center
}
.eyebrow{
  color:var(--rose);text-transform:uppercase;letter-spacing:.18em;font-size:10px;font-weight:700;
  display:flex;justify-content:center;align-items:center;gap:10px;margin-bottom:18px
}
.eyebrow-line{width:25px;height:1px;background:var(--rose)}
h1,h2{font-family:"Playfair Display",serif;font-weight:500;letter-spacing:-.045em;line-height:1.03}
h1{font-size:clamp(52px,7vw,84px)}
h1 em{color:var(--primary);font-style:italic}
.template-hero>p{
  max-width:590px;margin:25px auto 0;color:var(--muted);font-size:13px
}

.template-area{width:min(1180px,calc(100% - 40px));margin:75px auto 0}
.filter-row{
  display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-bottom:45px
}
.filter{
  border:1px solid var(--line);background:rgba(255,255,255,.5);color:var(--muted);
  border-radius:999px;padding:10px 15px;font-size:10px;font-weight:600;cursor:pointer;transition:.2s
}
.filter span{font-size:8px;margin-left:4px;opacity:.65}
.filter:hover,.filter.active{background:var(--primary);color:white;border-color:var(--primary)}

.template-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:55px 25px}
.template-card{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}
.template-card.show{opacity:1;transform:none}

.template-visual{
  aspect-ratio:1.28/1;min-height:420px;border-radius:27px;position:relative;overflow:hidden;
  display:grid;place-items:center;color:white;box-shadow:0 25px 65px rgba(58,9,26,.1)
}
.template-visual:before{
  content:"";position:absolute;width:72%;height:86%;border:1px solid rgba(255,255,255,.25);
  border-radius:50%;transform:rotate(-9deg)
}
.template-visual:after{
  content:"";position:absolute;inset:16px;border:1px solid rgba(255,255,255,.13);border-radius:20px
}
.rose{background:radial-gradient(circle at 65% 25%,#e9aabd,transparent 25%),linear-gradient(145deg,#b35b73,#4b0c20)}
.cream{background:radial-gradient(circle at 30% 25%,#fff5e9,transparent 24%),linear-gradient(145deg,#cfa59a,#6e3844)}
.wine{background:radial-gradient(circle at 70% 20%,#c87c8d,transparent 22%),linear-gradient(145deg,#571126,#21050c)}
.gold{background:radial-gradient(circle at 30% 20%,#e6c991,transparent 25%),linear-gradient(145deg,#8b6745,#351d1d)}
.blush{background:radial-gradient(circle at 70% 30%,#f6d5dc,transparent 25%),linear-gradient(145deg,#a64f67,#4e1728)}
.night{background:radial-gradient(circle at 35% 30%,#754057,transparent 25%),linear-gradient(145deg,#211019,#080609)}

.visual-top{
  position:absolute;top:22px;left:25px;right:25px;display:flex;justify-content:space-between;
  font-size:8px;letter-spacing:.15em;opacity:.65;z-index:2
}
.visual-center{position:relative;z-index:3;text-align:center;display:flex;flex-direction:column;align-items:center}
.visual-center small{font-size:9px;letter-spacing:.08em;opacity:.75}
.visual-symbol{font:80px "Playfair Display";font-style:italic;line-height:1;margin:20px 0 12px;color:#f7d7dd}
.visual-center strong{font:italic 31px "Playfair Display";font-weight:500}
.visual-frame{position:absolute;width:58%;height:55%;border:1px solid rgba(255,255,255,.12);border-radius:50%}
.visual-coming{
  position:absolute;bottom:22px;left:25px;font-size:7px;letter-spacing:.16em;opacity:.5;z-index:2
}

.template-info{padding:17px 3px 0;display:flex;justify-content:space-between;gap:25px}
.template-category{
  color:var(--rose);font-size:8px;text-transform:uppercase;letter-spacing:.16em;font-weight:700
}
.template-info h2{font-size:25px;margin:5px 0 7px}
.template-info p{font-size:10px;color:var(--muted);max-width:400px}
.use-template{
  align-self:end;white-space:nowrap;border-bottom:1px solid var(--primary);
  padding-bottom:4px;font-size:10px;font-weight:700;color:var(--primary)
}
.use-template span{margin-left:8px}

.empty-state{display:none;text-align:center;padding:70px 20px;color:var(--muted)}
.empty-state.show{display:block}
.empty-state>span{font:50px "Playfair Display";color:var(--rose)}
.empty-state h2{font-size:30px;color:var(--primary);margin:10px 0}
.empty-state p{font-size:11px}

.bottom-note{
  width:min(800px,calc(100% - 40px));margin:105px auto 120px;padding:20px 25px;
  border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.42);
  display:flex;align-items:center;gap:17px
}
.bottom-note>span{font:30px "Playfair Display";color:var(--rose)}
.bottom-note strong{font-size:11px;color:var(--primary)}
.bottom-note p{font-size:10px;color:var(--muted);margin-top:2px}

.footer{
  width:min(1180px,calc(100% - 40px));margin:0 auto;padding:30px 0 45px;
  border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;
  color:var(--muted);font-size:9px
}
.footer-logo{width:105px}.footer p{margin-top:5px}

@media(max-width:700px){
  .site-header{width:calc(100% - 24px);padding:9px 13px;top:7px}
  .brand-logo{width:108px}
  .step-indicator{display:none}
  .template-hero{margin-top:75px}
  h1{font-size:50px}
  .template-area{margin-top:55px}
  .template-grid{grid-template-columns:1fr;gap:40px}
  .template-visual{min-height:380px}
  .template-info{display:block}
  .use-template{display:inline-block;margin-top:18px}
  .bottom-note{margin:80px auto;padding:18px}
  .footer{display:block}
  .footer>span{display:block;margin-top:15px}
}
