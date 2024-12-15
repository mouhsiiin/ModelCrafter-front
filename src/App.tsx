// import { useState } from 'react';
// import { Upload, BarChart, Settings, Database } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// const Dashboard = () => {
//   const [activeSection, setActiveSection] = useState('upload');

//   const Navigation = () => (
//     <div className="flex space-x-4 mb-6">
//       <button
//         onClick={() => setActiveSection('upload')}
//         className={`flex items-center px-4 py-2 rounded-lg ${
//           activeSection === 'upload'
//             ? 'bg-blue-600 text-white'
//             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//         }`}
//       >
//         <Upload className="w-4 h-4 mr-2" />
//         Data Upload
//       </button>
//       <button
//         onClick={() => setActiveSection('prepare')}
//         className={`flex items-center px-4 py-2 rounded-lg ${
//           activeSection === 'prepare'
//             ? 'bg-blue-600 text-white'
//             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//         }`}
//       >
//         <Database className="w-4 h-4 mr-2" />
//         Data Preparation
//       </button>
//       <button
//         onClick={() => setActiveSection('analyze')}
//         className={`flex items-center px-4 py-2 rounded-lg ${
//           activeSection === 'analyze'
//             ? 'bg-blue-600 text-white'
//             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//         }`}
//       >
//         <BarChart className="w-4 h-4 mr-2" />
//         Analysis
//       </button>
//       <button
//         onClick={() => setActiveSection('settings')}
//         className={`flex items-center px-4 py-2 rounded-lg ${
//           activeSection === 'settings'
//             ? 'bg-blue-600 text-white'
//             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//         }`}
//       >
//         <Settings className="w-4 h-4 mr-2" />
//         Settings
//       </button>
//     </div>
//   );

//   const DataUploadSection = () => (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Upload Dataset</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
//           <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//           <p className="text-gray-600 mb-2">
//             Drag and drop your dataset here, or click to select files
//           </p>
//           <p className="text-sm text-gray-500">
//             Supported formats: CSV, JSON (max 100MB)
//           </p>
//           <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//             Select File
//           </button>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const DataPreparationSection = () => (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Data Preparation</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Data Preview</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600">No dataset selected</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Preprocessing Options</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Handle Missing Values
//                   </label>
//                   <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
//                     <option>Remove rows</option>
//                     <option>Fill with mean</option>
//                     <option>Fill with median</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Feature Scaling
//                   </label>
//                   <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
//                     <option>None</option>
//                     <option>Min-Max Scaling</option>
//                     <option>Standard Scaling</option>
//                   </select>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const AnalysisSection = () => (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Analysis</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Algorithm Selection</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Algorithm Type
//                   </label>
//                   <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
//                     <option>Linear Regression</option>
//                     <option>Decision Tree</option>
//                     <option>Random Forest</option>
//                     <option>SVM</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Parameters
//                   </label>
//                   <textarea
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                     placeholder="Algorithm parameters in JSON format"
//                   ></textarea>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Results</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600">No analysis results yet</p>
//             </CardContent>
//           </Card>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const SettingsSection = () => (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Settings</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               API Endpoint
//             </label>
//             <input
//               type="text"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               placeholder="http://localhost:8000"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Maximum File Size (MB)
//             </label>
//             <input
//               type="number"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               defaultValue="100"
//             />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">ML Analysis Dashboard</h1>
//       <Navigation />
//       <div className="mt-6">
//         {activeSection === 'upload' && <DataUploadSection />}
//         {activeSection === 'prepare' && <DataPreparationSection />}
//         {activeSection === 'analyze' && <AnalysisSection />}
//         {activeSection === 'settings' && <SettingsSection />}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/auth';
import { AppRoutes } from './routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;