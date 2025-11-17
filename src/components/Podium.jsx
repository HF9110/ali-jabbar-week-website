import { arabCountries } from "../utils/countries.js"; // (جديد)

// (جديد) دالة لجلب العلم
const getFlag = (countryName) => {
  const country = arabCountries.find(c => c.name === countryName);
  return country ? country.flag : '🌎';
};

export default function Podium({ submissions }) {
  const top3 = submissions ? [...submissions].sort((a,b)=>(b.votes || 0) - (a.votes || 0)).slice(0,3) : [];

  if (!top3.length) return null;

  // (جديد) تحديد الارتفاعات والتصاميم للمراكز
  const podiumStyles = [
    // المركز الأول
    {
      height: 'h-48 md:h-60',
      bg: 'bg-yellow-500 border-yellow-300',
      order: 'order-1',
      text: 'text-6xl',
      name: 'text-2xl font-bold text-yellow-400',
      // (جديد) إضافة وميض للمركز الأول
      animation: 'animate-glow'
    },
    // المركز الثاني
    {
      height: 'h-36 md:h-48',
      bg: 'bg-gray-400 border-gray-300',
      order: 'order-2 md:order-first',
      text: 'text-5xl',
      name: 'text-xl font-bold text-gray-200'
    },
    // المركز الثالث
    {
      height: 'h-24 md:h-36',
      bg: 'bg-yellow-800 border-yellow-600',
      order: 'order-3',
      text: 'text-4xl',
      name: 'text-lg font-bold text-yellow-700'
    }
  ];
  
  // (جديد) إعادة ترتيب لضمان العرض الصحيح (2, 1, 3)
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const styleOrder = [podiumStyles[1], podiumStyles[0], podiumStyles[2]];

  return (
    <div className="flex justify-center items-end gap-2 md:gap-4 mb-10 pt-10 w-full max-w-2xl mx-auto">
      
      {podiumOrder.map((sub, idx) => {
        // (جديد) استخدام (idx + 1) للترتيب الفعلي (2, 1, 3)
        const rank = (idx === 0 ? 2 : (idx === 1 ? 1 : 3));
        const style = styleOrder[idx];
        
        if (!sub) return <div key={idx} className={`${style.order} w-24 md:w-32`}></div>; // (جديد) حاجز لضمان الترتيب
        
        return (
          <div key={sub.id} className={`flex flex-col items-center ${style.order} ${style.animation || ''}`}>
            <p className={`${style.name} mb-1 truncate w-32 text-center`}>{sub.name}</p>
            {sub.country && (
              <p className="text-lg mb-1" title={sub.country}>{getFlag(sub.country)}</p>
            )}
            <div className={`flex items-center justify-center w-24 md:w-32 ${style.height} ${style.bg} rounded-t-lg border-2 border-b-0`}>
              <span className={`${style.text} font-bold text-white`}>{rank}</span>
            </div>
          </div>
        )
      })}
      
    </div>
  );
}