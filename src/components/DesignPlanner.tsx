import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { defaultDesignPlan, DesignFinish, DesignItem, DesignItemType, DesignPlan, designStorageKey } from '@/lib/designPlan';

const itemDefaults: Record<DesignItemType, Omit<DesignItem, 'id' | 'type' | 'label' | 'xMm' | 'yMm'>> = {
  baseCabinet: { widthMm: 900, depthMm: 600, finish: 'laminate' },
  tallCabinet: { widthMm: 600, depthMm: 600, finish: 'polyurethane' },
  sink: { widthMm: 600, depthMm: 600, finish: 'stainless' },
  cooktop: { widthMm: 600, depthMm: 600, finish: 'stainless' },
  fridge: { widthMm: 900, depthMm: 700, finish: 'stainless' },
  island: { widthMm: 1800, depthMm: 900, finish: 'porcelain' },
};

const labels: Record<DesignItemType, string> = {
  baseCabinet: 'Base cabinet',
  tallCabinet: 'Tall cabinet',
  sink: 'Sink',
  cooktop: 'Cooktop',
  fridge: 'Fridge',
  island: 'Island',
};

const finishColors: Record<DesignFinish, string> = {
  laminate: '#d8c9ad',
  polyurethane: '#f4f1ea',
  timber: '#9b6f3d',
  porcelain: '#dfe4e1',
  stainless: '#b9c4c5',
};

function freshPlan(): DesignPlan {
  return { ...defaultDesignPlan, room: { ...defaultDesignPlan.room }, items: defaultDesignPlan.items.map((item) => ({ ...item })) };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function drawPlan(canvas: HTMLCanvasElement, plan: DesignPlan) {
  const context = canvas.getContext('2d');
  if (!context) return;
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#fbfaf6';
  context.fillRect(0, 0, width, height);

  const padding = 42;
  const scale = Math.min((width - padding * 2) / plan.room.widthMm, (height - padding * 2) / plan.room.depthMm);
  const roomWidth = plan.room.widthMm * scale;
  const roomDepth = plan.room.depthMm * scale;
  const originX = (width - roomWidth) / 2;
  const originY = (height - roomDepth) / 2;

  context.fillStyle = '#ffffff';
  context.strokeStyle = '#17211d';
  context.lineWidth = 3;
  context.fillRect(originX, originY, roomWidth, roomDepth);
  context.strokeRect(originX, originY, roomWidth, roomDepth);
  context.fillStyle = '#63706a';
  context.font = '14px sans-serif';
  context.fillText(`${plan.room.widthMm}mm`, originX + roomWidth / 2 - 34, originY - 14);
  context.save();
  context.translate(originX - 18, originY + roomDepth / 2 + 34);
  context.rotate(-Math.PI / 2);
  context.fillText(`${plan.room.depthMm}mm`, 0, 0);
  context.restore();

  plan.items.forEach((item) => {
    const x = originX + item.xMm * scale;
    const y = originY + item.yMm * scale;
    const itemWidth = item.widthMm * scale;
    const itemDepth = item.depthMm * scale;
    context.fillStyle = finishColors[item.finish];
    context.strokeStyle = '#1f6f5b';
    context.lineWidth = 2;
    context.fillRect(x, y, itemWidth, itemDepth);
    context.strokeRect(x, y, itemWidth, itemDepth);
    context.fillStyle = '#17211d';
    context.font = '12px sans-serif';
    context.fillText(item.label, x + 6, y + 18);
  });
}

export default function DesignPlanner() {
  const [plan, setPlan] = useState<DesignPlan>(freshPlan);
  const [selectedId, setSelectedId] = useState(plan.items[0]?.id || '');
  const [message, setMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selected = useMemo(() => plan.items.find((item) => item.id === selectedId) || plan.items[0], [plan.items, selectedId]);

  useEffect(() => {
    const saved = window.localStorage.getItem(designStorageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setPlan(parsed);
      setSelectedId(parsed.items?.[0]?.id || '');
    } catch {
      window.localStorage.removeItem(designStorageKey);
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) drawPlan(canvasRef.current, plan);
  }, [plan]);

  function updateRoom(patch: Partial<DesignPlan['room']>) {
    setPlan((current) => ({ ...current, room: { ...current.room, ...patch } }));
  }

  function addItem(type: DesignItemType) {
    const defaults = itemDefaults[type];
    const item: DesignItem = {
      id: `${type}-${Date.now()}`,
      type,
      label: labels[type],
      xMm: 300,
      yMm: 300,
      ...defaults,
    };
    setPlan((current) => ({ ...current, items: [...current.items, item] }));
    setSelectedId(item.id);
  }

  function updateItem(patch: Partial<DesignItem>) {
    if (!selected) return;
    setPlan((current) => ({
      ...current,
      items: current.items.map((item) => item.id === selected.id ? {
        ...item,
        ...patch,
        xMm: patch.xMm === undefined ? item.xMm : clamp(patch.xMm, 0, current.room.widthMm),
        yMm: patch.yMm === undefined ? item.yMm : clamp(patch.yMm, 0, current.room.depthMm),
      } : item),
    }));
  }

  function removeSelected() {
    if (!selected) return;
    setPlan((current) => ({ ...current, items: current.items.filter((item) => item.id !== selected.id) }));
    setSelectedId('');
  }

  function exportPlan() {
    const previewImage = canvasRef.current?.toDataURL('image/png');
    const exported: DesignPlan = { ...plan, exportedAt: new Date().toISOString(), previewImage };
    window.localStorage.setItem(designStorageKey, JSON.stringify(exported));
    setPlan(exported);
    setMessage('Design saved. It will attach automatically when you submit the quote wizard in this browser.');
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify({ ...plan, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'operon-kitchens-design-plan.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function downloadImage() {
    const url = canvasRef.current?.toDataURL('image/png');
    if (!url) return;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'operon-kitchens-design-plan.png';
    anchor.click();
  }

  return (
    <div className="designWorkbench">
      <section className="designCanvasPanel">
        <canvas ref={canvasRef} width={920} height={620} aria-label="Kitchen design plan canvas" />
        <div className="designPreview3d" aria-label="Simple 3D-style kitchen preview">
          {plan.items.map((item) => (
            <span key={item.id} style={{ background: finishColors[item.finish], width: `${Math.max(36, item.widthMm / 24)}px`, height: `${Math.max(28, item.depthMm / 24)}px` }}>
              {item.label}
            </span>
          ))}
        </div>
      </section>
      <aside className="designControls">
        <section className="quoteResult">
          <h2>Room measurements</h2>
          <p className="muted">Enter measurements in millimetres. Measure each wall, ceiling height, openings, service points and any out-of-square walls.</p>
          <div className="formGrid">
            <label className="field"><span>Room width (mm)</span><input type="number" min="1000" value={plan.room.widthMm} onChange={(event) => updateRoom({ widthMm: Number(event.target.value) || 0 })} /></label>
            <label className="field"><span>Room depth (mm)</span><input type="number" min="1000" value={plan.room.depthMm} onChange={(event) => updateRoom({ depthMm: Number(event.target.value) || 0 })} /></label>
            <label className="field"><span>Ceiling height (mm)</span><input type="number" min="1800" value={plan.room.ceilingHeightMm} onChange={(event) => updateRoom({ ceilingHeightMm: Number(event.target.value) || 0 })} /></label>
          </div>
        </section>

        <section className="quoteResult">
          <h2>Place items</h2>
          <div className="choiceGrid compact">
            {(Object.keys(labels) as DesignItemType[]).map((type) => <button key={type} className="button ghost" type="button" onClick={() => addItem(type)}>{labels[type]}</button>)}
          </div>
          {selected && (
            <div className="designEditor">
              <label className="field"><span>Selected item</span><select value={selected.id} onChange={(event) => setSelectedId(event.target.value)}>{plan.items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
              <label className="field"><span>Label</span><input value={selected.label} onChange={(event) => updateItem({ label: event.target.value })} /></label>
              <div className="formGrid two">
                <label className="field"><span>X position (mm)</span><input type="number" min="0" value={selected.xMm} onChange={(event) => updateItem({ xMm: Number(event.target.value) || 0 })} /></label>
                <label className="field"><span>Y position (mm)</span><input type="number" min="0" value={selected.yMm} onChange={(event) => updateItem({ yMm: Number(event.target.value) || 0 })} /></label>
                <label className="field"><span>Width (mm)</span><input type="number" min="100" value={selected.widthMm} onChange={(event) => updateItem({ widthMm: Number(event.target.value) || 0 })} /></label>
                <label className="field"><span>Depth (mm)</span><input type="number" min="100" value={selected.depthMm} onChange={(event) => updateItem({ depthMm: Number(event.target.value) || 0 })} /></label>
              </div>
              <label className="field"><span>Finish</span><select value={selected.finish} onChange={(event) => updateItem({ finish: event.target.value as DesignFinish })}><option value="laminate">Laminate</option><option value="polyurethane">Polyurethane</option><option value="timber">Timber</option><option value="porcelain">Porcelain</option><option value="stainless">Stainless steel</option></select></label>
              <button type="button" className="button ghost" onClick={removeSelected}>Remove selected</button>
            </div>
          )}
        </section>

        <section className="quoteResult">
          <h2>Save and attach</h2>
          <p className="muted">Save this design before opening the quote wizard. The plan JSON and preview image will attach to your estimate request in this browser.</p>
          <div className="flexActions compactActions">
            <button type="button" className="button primary" onClick={exportPlan}>Save to quote</button>
            <button type="button" className="button ghost" onClick={downloadJson}>Export JSON</button>
            <button type="button" className="button ghost" onClick={downloadImage}>Export image</button>
          </div>
          {message && <p className="successPanel">{message}</p>}
          <Link href="/quote" className="textLink">Open quote wizard</Link>
        </section>
      </aside>
    </div>
  );
}
