export function Art({ song, size=200, style={}, borderRadius=0 }) {
  const { id, h, s } = song;
  const a = (id*53)%360;
  return (
    <div style={{
      width: size||"100%", height: size||"100%", borderRadius, flexShrink:0,
      background: `linear-gradient(${a}deg, hsl(${h},${s}%,44%) 0%, hsl(${(h+35)%360},${Math.max(s-10,30)}%,30%) 40%, hsl(${(h+70)%360},${Math.max(s-25,20)}%,16%) 100%)`,
      position:"relative", overflow:"hidden", ...style,
    }}>
      <div style={{ position:"absolute",inset:0, background:`radial-gradient(ellipse at ${25+(id*17)%35}% ${15+(id*11)%30}%, hsla(${h},${s+10}%,75%,.22) 0%, transparent 50%)`}}/>
      <div style={{ position:"absolute",inset:0, background:`radial-gradient(circle at ${65+(id*7)%25}% ${70+(id*13)%20}%, hsla(${(h+160)%360},${s}%,55%,.12) 0%, transparent 45%)`}}/>
      <div style={{ position:"absolute",inset:0, background:`linear-gradient(180deg, transparent 50%, rgba(0,0,0,.4) 100%)`}}/>
    </div>
  );
}
