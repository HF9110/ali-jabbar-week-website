import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.js'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, CheckCircle, Clock, BarChart2, Loader2 } from 'lucide-react';
import { motion } from "framer-motion";

// بطاقة إحصائية
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  });
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const submissionsCol = collection(db, 'submissions');
    const unsubscribe = onSnapshot(submissionsCol, (snapshot) => {
      let total = 0;
      let approved = 0;
      let pending = 0;
      const countryCounts = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        total++;
        if (data.approved) {
          approved++;
        } else {
          pending++;
        }
        
        if (data.country) {
          countryCounts[data.country] = (countryCounts[data.country] || 0) + 1;
        }
      });

      setStats({ total, approved, pending });

      const chartData = Object.entries(countryCounts).map(([name, value]) => ({
        name,
        value,
      }));
      setCountryData(chartData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching stats: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-gray-800">نظرة عامة</h1>
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="إجمالي المشاركات" 
          value={stats.total} 
          icon={<Users className="text-blue-800" />} 
          color="bg-blue-100" 
        />
        <StatCard 
          title="المشاركات المقبولة" 
          value={stats.approved} 
          icon={<CheckCircle className="text-green-800" />} 
          color="bg-green-100" 
        />
        <StatCard 
          title="المشاركات المعلقة" 
          value={stats.pending} 
          icon={<Clock className="text-yellow-800" />} 
          color="bg-yellow-100" 
        />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 min-h-[400px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 />
            المشاركات حسب البلد
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" name="عدد المشاركات" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 min-h-[400px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">توزيع الدول</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}