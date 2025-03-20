export default function Card({ title, value }: { title: string; value: string }) {
     return (
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300">
               <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
               <p className="text-2xl font-bold mt-2 text-white">{value}</p>
          </div>
     );
}