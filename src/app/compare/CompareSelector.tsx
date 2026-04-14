'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export interface ServiceItem {
  slug: string;
  name: string;
  score: number;
  reviewCount: number;
  abbr: string;
  avatarClass: string;
  categoryName: string;
  badgeClass: string;
  badgeLabel: string;
}

interface Props {
  services: ServiceItem[];
  initialA: string | null;
  initialB: string | null;
}

export default function CompareSelector({ services, initialA, initialB }: Props) {
  const router = useRouter();
  const [selectedA, setSelectedA] = useState<string | null>(initialA);
  const [selectedB, setSelectedB] = useState<string | null>(initialB);
  const [activeSlot, setActiveSlot] = useState<'a' | 'b'>(initialA && !initialB ? 'b' : 'a');
  const [query, setQuery] = useState('');

  const serviceA = services.find(s => s.slug === selectedA) ?? null;
  const serviceB = services.find(s => s.slug === selectedB) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.categoryName.toLowerCase().includes(q)
    );
  }, [services, query]);

  const handleSelect = (slug: string) => {
    if (activeSlot === 'a') {
      setSelectedA(slug);
      if (!selectedB) setActiveSlot('b');
    } else {
      setSelectedB(slug);
      if (!selectedA) setActiveSlot('a');
    }
  };

  const handleCompare = () => {
    if (selectedA && selectedB) {
      router.push(`/compare?a=${selectedA}&b=${selectedB}`);
    }
  };

  const slotStyle = (slot: 'a' | 'b') => ({
    border: `2px solid ${activeSlot === slot ? 'var(--pr-accent)' : 'var(--pr-border)'}`,
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    background: activeSlot === slot ? 'var(--pr-accent-dim)' : 'var(--pr-surface)',
    minHeight: '88px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'border-color .15s, background .15s',
  } as React.CSSProperties);

  const renderSlot = (slot: 'a' | 'b', service: ServiceItem | null) => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setActiveSlot(slot)}
      onKeyDown={e => e.key === 'Enter' && setActiveSlot(slot)}
      style={slotStyle(slot)}
    >
      {service ? (
        <>
          <span className={`pr-service-avatar ${service.avatarClass}`} style={{ flexShrink: 0 }}>
            {service.abbr}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--pr-text-pri)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {service.name}
            </div>
            <span className={`pr-cat-badge ${service.badgeClass}`} style={{ fontSize: '10px' }}>
              {service.badgeLabel}
            </span>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              if (slot === 'a') { setSelectedA(null); setActiveSlot('a'); }
              else { setSelectedB(null); setActiveSlot('b'); }
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pr-text-ter)', fontSize: '18px', lineHeight: 1, flexShrink: 0, padding: '2px' }}
            aria-label="選択を解除"
          >
            ✕
          </button>
        </>
      ) : (
        <div style={{
          color: activeSlot === slot ? 'var(--pr-accent)' : 'var(--pr-text-ter)',
          fontSize: '14px',
          fontWeight: activeSlot === slot ? 600 : 400,
        }}>
          {activeSlot === slot ? '↓ 下のリストから選択してください' : `＋ サービス${slot.toUpperCase()}を選ぶ`}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* 2スロット選択エリア */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 36px 1fr',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        {renderSlot('a', serviceA)}
        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '12px', color: 'var(--pr-text-ter)', letterSpacing: '.05em' }}>
          VS
        </div>
        {renderSlot('b', serviceB)}
      </div>

      {/* 比較ボタン */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <button
          onClick={handleCompare}
          disabled={!selectedA || !selectedB}
          className="pr-btn-primary"
          style={{
            padding: '10px 36px',
            fontSize: '14px',
            fontWeight: 700,
            opacity: selectedA && selectedB ? 1 : 0.35,
            cursor: selectedA && selectedB ? 'pointer' : 'not-allowed',
            transition: 'opacity .15s',
          }}
        >
          比較する →
        </button>
      </div>

      {/* 区切り線 */}
      <div style={{ borderTop: '1px solid var(--pr-border)', marginBottom: '24px' }} />

      {/* 検索バー */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <span style={{
          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--pr-text-ter)', fontSize: '13px', pointerEvents: 'none',
        }}>
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="サービス名・カテゴリで検索..."
          style={{
            width: '100%',
            height: '40px',
            background: 'var(--pr-surface)',
            border: '1px solid var(--pr-border)',
            borderRadius: '8px',
            padding: '0 12px 0 36px',
            fontSize: '14px',
            color: 'var(--pr-text-pri)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pr-text-ter)', fontSize: '14px',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 件数表示 */}
      <div style={{ fontSize: '12px', color: 'var(--pr-text-ter)', marginBottom: '12px' }}>
        {filtered.length} 件
        {(selectedA || selectedB) && (
          <span style={{ marginLeft: '12px', color: 'var(--pr-accent)' }}>
            {[selectedA && 'A選択済み', selectedB && 'B選択済み'].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>

      {/* サービスグリッド */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '8px',
        marginBottom: '48px',
      }}>
        {filtered.map(service => {
          const isA = service.slug === selectedA;
          const isB = service.slug === selectedB;
          const isSelected = isA || isB;
          const slotLabel = isA ? 'A' : isB ? 'B' : null;

          return (
            <button
              key={service.slug}
              onClick={() => handleSelect(service.slug)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                background: isSelected ? 'var(--pr-accent-dim)' : 'var(--pr-surface)',
                border: `1px solid ${isSelected ? 'var(--pr-accent)' : 'var(--pr-border)'}`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color .12s, background .12s',
                width: '100%',
              }}
            >
              <span
                className={`pr-service-avatar ${service.avatarClass}`}
                style={{ flexShrink: 0, width: '32px', height: '32px', fontSize: '11px', borderRadius: '8px' }}
              >
                {service.abbr}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'var(--pr-text-pri)',
                  marginBottom: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{service.name}</span>
                  {slotLabel && (
                    <span style={{
                      fontSize: '10px',
                      background: 'var(--pr-accent)',
                      color: '#fff',
                      borderRadius: '4px',
                      padding: '1px 5px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {slotLabel}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--pr-text-ter)' }}>
                  ★{service.score.toFixed(1)} · {service.reviewCount}件
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
