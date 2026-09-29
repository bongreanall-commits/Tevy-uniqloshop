import React from 'react';
import { X, Ruler } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-black text-gray-900">
              តារាងទំហំ GU Japan (Size Guide)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          <div>
            <h4 className="font-bold text-gray-800 mb-2">ខោខ្លី និងខោវែង (Pants & Shorts Size Chart - cm)</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-extrabold text-[11px]">
                    <th className="p-2.5 border-b border-gray-200">Size</th>
                    <th className="p-2.5 border-b border-gray-200">ចង្កេះ (Waist)</th>
                    <th className="p-2.5 border-b border-gray-200">ត្រគាក (Hips)</th>
                    <th className="p-2.5 border-b border-gray-200">ប្រវែង (Length)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr>
                    <td className="p-2.5 font-bold text-gray-900">XS</td>
                    <td className="p-2.5">58 - 64 cm</td>
                    <td className="p-2.5">82 - 88 cm</td>
                    <td className="p-2.5">38 cm</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-2.5 font-bold text-gray-900">S</td>
                    <td className="p-2.5">60 - 66 cm</td>
                    <td className="p-2.5">85 - 91 cm</td>
                    <td className="p-2.5">40 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-gray-900">M</td>
                    <td className="p-2.5">64 - 70 cm</td>
                    <td className="p-2.5">89 - 95 cm</td>
                    <td className="p-2.5">42 cm</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-2.5 font-bold text-gray-900">L</td>
                    <td className="p-2.5">69 - 75 cm</td>
                    <td className="p-2.5">94 - 100 cm</td>
                    <td className="p-2.5">44 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-gray-900">XL</td>
                    <td className="p-2.5">75 - 81 cm</td>
                    <td className="p-2.5">100 - 106 cm</td>
                    <td className="p-2.5">46 cm</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-2.5 font-bold text-gray-900">XXL</td>
                    <td className="p-2.5">81 - 87 cm</td>
                    <td className="p-2.5">106 - 112 cm</td>
                    <td className="p-2.5">47 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
            <span className="font-bold">💡 គន្លឹះជ្រើសរើសទំហំ (Fitting Tip):</span> ម៉ូតជប៉ុន GU Japan គឺជារាង Slim & Relaxed។ ប្រសិនបើអ្នកចូលចិត្តស្លៀកបែប Oversized ឬទូលាយបន្តិច សូមជ្រើសរើសទំហំធំជាងមួយលេខ (Size Up)។
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition"
          >
            យល់ព្រម (Got it)
          </button>
        </div>
      </div>
    </div>
  );
}
