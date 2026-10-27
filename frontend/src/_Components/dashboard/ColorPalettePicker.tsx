'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Palette, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/_Components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/utils/apiConfig';
import { toast } from 'sonner';

export interface ColorItem {
  id?: string;
  name: string;
  hexCode: string;
  isQuickSaved?: boolean;
}

const DEFAULT_PRESET_COLORS: ColorItem[] = [
  { name: 'وردي مغبر (Dusty Rose)', hexCode: '#C48D80' },
  { name: 'بيج دافئ (Warm Nude)', hexCode: '#E5C2AF' },
  { name: 'رمادي داكن (Taupe)', hexCode: '#988172' },
  { name: 'كريمي عاجي (Cream Ivory)', hexCode: '#FBF9F3' },
  { name: 'أخضر هادئ (Sage Green)', hexCode: '#9CAF88' },
  { name: 'كحلي كلاسيك (Navy Blue)', hexCode: '#000080' },
  { name: 'أسود ملكي (Black)', hexCode: '#000000' },
  { name: 'أبيض ناصع (Pure White)', hexCode: '#FFFFFF' },
  { name: 'خمري نبيذي (Burgundy)', hexCode: '#722F37' },
  { name: 'لافندر ناعم (Lavender)', hexCode: '#D8B4E2' },
  { name: 'وردي زاهي (Blush Pink)', hexCode: '#F4C2C2' },
  { name: 'خردلي دافئ (Mustard)', hexCode: '#E1AD01' },
];

const LOCAL_STORAGE_KEY = 'roaa_quick_palette_colors_v2';

interface ColorPalettePickerProps {
  selectedColorId?: string;
  selectedHex?: string;
  onSelectColor: (color: ColorItem) => void;
  token?: string;
}

export default function ColorPalettePicker({
  selectedColorId,
  selectedHex,
  onSelectColor,
  token,
}: ColorPalettePickerProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [paletteColors, setPaletteColors] = useState<ColorItem[]>(DEFAULT_PRESET_COLORS);
  const [customName, setCustomName] = useState('');
  const [customHex, setCustomHex] = useState('#C48D80');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onSelectColorRef = useRef(onSelectColor);
  onSelectColorRef.current = onSelectColor;

  // Load colors once on mount
  useEffect(() => {
    let savedLocal: ColorItem[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        savedLocal = JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    // Fetch backend colors
    fetch(`${API_BASE_URL}/products/meta/colors`, { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const backendColors: ColorItem[] = Array.isArray(data?.data) ? data.data : [];
        const map = new Map<string, ColorItem>();

        // 1. Defaults
        DEFAULT_PRESET_COLORS.forEach((c) => map.set(c.hexCode.toUpperCase(), c));

        // 2. Local quick saved
        savedLocal.forEach((c) => map.set(c.hexCode.toUpperCase(), { ...c, isQuickSaved: true }));

        // 3. Backend colors (have real DB UUIDs)
        backendColors.forEach((c) => {
          map.set(c.hexCode.toUpperCase(), {
            id: c.id,
            name: c.name,
            hexCode: c.hexCode,
            isQuickSaved: true,
          });
        });

        const merged = Array.from(map.values());
        setPaletteColors(merged);

        // If no color selected yet, default to first available
        if (!selectedColorId && !selectedHex && merged.length > 0) {
          onSelectColorRef.current(merged[0]);
        }
      })
      .catch(() => {
        const map = new Map<string, ColorItem>();
        DEFAULT_PRESET_COLORS.forEach((c) => map.set(c.hexCode.toUpperCase(), c));
        savedLocal.forEach((c) => map.set(c.hexCode.toUpperCase(), { ...c, isQuickSaved: true }));
        const merged = Array.from(map.values());
        setPaletteColors(merged);
        if (!selectedColorId && !selectedHex && merged.length > 0) {
          onSelectColorRef.current(merged[0]);
        }
      });
  }, []); // Run on mount only, no unnecessary re-fetches

  const handleSelect = (color: ColorItem) => {
    onSelectColor(color);
  };

  const handleAddAndSaveQuickColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      toast.error(isAr ? 'يرجى إدخال اسم اللون' : 'Color name is required');
      return;
    }

    const hex = customHex.startsWith('#') ? customHex.toUpperCase() : `#${customHex.toUpperCase()}`;
    setIsSaving(true);

    let createdId: string | undefined = undefined;

    // Save to backend if admin token available
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['token'] = token;
      }

      const res = await fetch(`${API_BASE_URL}/products/meta/colors`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: customName.trim(),
          hexCode: hex,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data?.id) {
          createdId = json.data.id;
        }
      }
    } catch {
      // ignore
    }

    const newColor: ColorItem = {
      id: createdId,
      name: customName.trim(),
      hexCode: hex,
      isQuickSaved: true,
    };

    // Update list & select
    const updated = [newColor, ...paletteColors.filter((c) => c.hexCode.toUpperCase() !== hex)];
    setPaletteColors(updated);

    // Persist in localStorage
    try {
      const quickOnly = updated.filter((c) => c.isQuickSaved);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quickOnly));
    } catch {
      // ignore
    }

    onSelectColor(newColor);
    toast.success(
      isAr
        ? `تم حفظ اللون "${newColor.name}" في اللوحة السريعة بنجاح!`
        : `Color "${newColor.name}" saved to quick palette!`
    );

    setIsSaving(false);
    setShowAddForm(false);
    setCustomName('');
  };

  const handleRemoveQuickColor = (colorHex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = paletteColors.filter((c) => c.hexCode.toUpperCase() !== colorHex.toUpperCase());
    setPaletteColors(updated);
    try {
      const quickOnly = updated.filter((c) => c.isQuickSaved);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quickOnly));
    } catch {
      // ignore
    }
    toast.info(isAr ? 'تمت إزالة اللون من اللوحة السريعة' : 'Removed from quick palette');
  };

  // Find active selected color
  const activeColor =
    paletteColors.find(
      (c) =>
        (selectedColorId && c.id === selectedColorId) ||
        (selectedHex && c.hexCode.toUpperCase() === selectedHex.toUpperCase())
    ) || paletteColors[0];

  return (
    <div className="space-y-3 p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#C48D80]" />
          <label className="text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0]">
            {isAr ? 'لوحة الألوان (Color Palette)' : 'Color Palette'}
          </label>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C48D80] hover:text-[#B27B6E] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? (isAr ? 'إغلاق الإضافة' : 'Close') : (isAr ? 'إضافة لون مخصص' : 'Add Custom')}</span>
        </button>
      </div>

      {/* Selected Color Preview Badge */}
      {activeColor && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span
              className="size-5 rounded-full border border-black/10 dark:border-white/20 shadow-2xs"
              style={{ backgroundColor: activeColor.hexCode }}
            />
            <div>
              <p className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {activeColor.name}
              </p>
              <p className="text-[10px] font-mono text-[#988172]">{activeColor.hexCode}</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#C48D80] font-medium border border-[#C48D80]/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {isAr ? 'اللون النشط' : 'Active'}
          </span>
        </div>
      )}

      {/* Add Custom Color Expandable Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddAndSaveQuickColor}
          className="p-3 rounded-xl bg-white dark:bg-[#28211E] border border-[#C48D80]/30 shadow-xs space-y-2.5 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="text-[11px] font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
            {isAr ? 'حفظ لون جديد في اللوحة السريعة:' : 'Save New Color for Quick Use:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            {/* Color Swatch Picker */}
            <div className="sm:col-span-2 flex items-center gap-1.5">
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                className="w-10 h-9 p-0.5 rounded-lg border border-[#EBDED6] cursor-pointer bg-transparent"
                title={isAr ? 'اختاري الدرجة بالمنتقي' : 'Pick color'}
              />
            </div>

            {/* Color Name */}
            <div className="sm:col-span-5">
              <input
                type="text"
                placeholder={isAr ? 'اسم اللون (مثال: خوخي رقيق)' : 'Color Name (e.g. Soft Peach)'}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#EBDED6] dark:border-[#3D332E] text-xs bg-[#FAF7F2] dark:bg-[#1F1917] text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                required
              />
            </div>

            {/* Hex Code Input */}
            <div className="sm:col-span-3">
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#C48D80"
                className="w-full px-2 py-1.5 rounded-lg border border-[#EBDED6] dark:border-[#3D332E] text-xs font-mono bg-[#FAF7F2] dark:bg-[#1F1917] text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                required
              />
            </div>

            {/* Save Button */}
            <div className="sm:col-span-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full h-8 text-[11px] rounded-lg bg-[#C48D80] hover:bg-[#B27B6E] text-white py-1 px-2 font-semibold"
              >
                {isSaving ? (isAr ? 'حفظ...' : 'Saving...') : (isAr ? 'حفظ سريع' : 'Quick Save')}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Swatches Grid */}
      <div>
        <div className="text-[10px] text-[#988172] mb-1.5 flex items-center justify-between">
          <span>{isAr ? 'انقري لاختيار اللون المباشر:' : 'Click to select color:'}</span>
          <span className="text-[9px]">
            {paletteColors.length} {isAr ? 'لون متوفر' : 'available'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 rounded-xl bg-white/60 dark:bg-[#28211E]/60 border border-[#EBDED6]/60 dark:border-[#3D332E]/60">
          {paletteColors.map((color) => {
            const isSelected =
              (activeColor?.id && color.id && activeColor.id === color.id) ||
              activeColor?.hexCode.toUpperCase() === color.hexCode.toUpperCase();

            return (
              <button
                key={`${color.name}-${color.hexCode}`}
                type="button"
                onClick={() => handleSelect(color)}
                title={`${color.name} (${color.hexCode})`}
                className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-start transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#C48D80] bg-white dark:bg-[#28211E] shadow-xs ring-2 ring-[#C48D80]/20'
                    : 'border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80]/60 bg-white/80 dark:bg-[#1F1917]'
                }`}
              >
                {/* Circle swatch */}
                <span
                  className="size-4 rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ backgroundColor: color.hexCode }}
                >
                  {isSelected && (
                    <Check
                      className={`w-2.5 h-2.5 ${
                        ['#FFFFFF', '#FBF9F3', '#FFF'].includes(color.hexCode.toUpperCase())
                          ? 'text-black'
                          : 'text-white'
                      }`}
                    />
                  )}
                </span>

                {/* Name */}
                <span
                  className={`text-[11px] truncate max-w-[90px] ${
                    isSelected
                      ? 'font-bold text-[#C48D80]'
                      : 'text-[#2B2320] dark:text-[#FAF6F0]'
                  }`}
                >
                  {color.name}
                </span>

                {/* Remove button for custom saved */}
                {color.isQuickSaved && (
                  <span
                    onClick={(e) => handleRemoveQuickColor(color.hexCode, e)}
                    title={isAr ? 'إزالة من اللوحة السريعة' : 'Remove'}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-500 p-0.5 rounded text-[#988172] transition-opacity"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
