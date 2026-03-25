import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

export default function ArabicApp() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. نظام الحماية (كلمة المرور)
  const login = () => {
    if (pass === "admin123") setAuth(true); // يمكنك تغيير الباسورد هنا
    else alert("كلمة المرور خاطئة!");
  };

  // 2. معالجة النص العربي للبحث (إزالة الهمزات والتشكيل)
  const cleanAr = (text) => {
    if (!text) return "";
    return text.toString()
      .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, "").trim();
  };

  // 3. دالة رفع ملف الإكسيل
  const uploadExcel = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
      setLoading(true);
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);

      const rows = json.map(row => ({
        row_data: row,
        search_text: cleanAr(Object.values(row).join(' '))
      }));

      const { error } = await supabase.from('excel_data').insert(rows);
      setLoading(false);
      if (!error) alert("تم رفع البيانات بنجاح!");
    };
    reader.readAsBinaryString(file);
  };

  // 4. دالة البحث
  const doSearch = async (val) => {
    setSearch(val);
    const { data: res } = await supabase
      .from('excel_data')
      .select('*')
      .ilike('search_text', `%${cleanAr(val)}%`)
      .limit(100);
    setData(res || []);
  };

  if (!auth) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-sans" dir="rtl">
      <div className="p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">الدخول للنظام</h1>
        <input type="password" onChange={e=>setPass(e.target.value)} className="border p-2 rounded mb-4 w-64 block" placeholder="كلمة المرور" />
        <button onClick={login} className="bg-blue-600 text-white px-8 py-2 rounded">دخول</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold text-blue-900">قاعدة بيانات التمويل</h1>
          <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700">
            {loading ? "جاري الرفع..." : "رفع ملف Excel جديد"}
            <input type="file" hidden onChange={uploadExcel} accept=".xlsx, .csv" />
          </label>
        </div>

        <input 
          type="text" 
          placeholder="ابحث عن اسم، مبلغ، فرع..." 
          className="w-full p-4 rounded-xl border-2 border-blue-100 mb-6 text-lg outline-none focus:border-blue-500 shadow-sm"
          onChange={e => doSearch(e.target.value)}
        />

        <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 border">البيانات التفصيلية</th>
                <th className="p-4 border">التوقيت</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(item.row_data).map(([key, val]) => (
                        <div key={key} className="text-sm"><span className="font-bold text-gray-600">{key}:</span> {val}</div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString('ar-EG')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="p-10 text-center text-gray-400">أدخل نصاً للبحث أو ارفع ملفاً للبدء</p>}
        </div>
      </div>
    </div>
  );
}