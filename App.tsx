
import React, { useState, useCallback } from 'react';
import { PhotoState } from './types';
import { LOCATIONS, COSTUMES } from './constants';
import { generatePhoto } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<PhotoState>({
    images: [],
    selectedLocation: LOCATIONS[0].name,
    customLocation: '',
    selectedCostume: COSTUMES[0].name,
    isGenerating: false,
    resultImage: null,
    error: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Explicitly type the file parameter as File (which extends Blob) to resolve the 'unknown' type error
    const filePromises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((results) => {
      setState((prev) => ({ ...prev, images: results }));
    });
  };

  const handleGenerate = async () => {
    if (state.images.length === 0) {
      setState((prev) => ({ ...prev, error: "Please upload at least one photo." }));
      return;
    }

    const finalLocation = state.customLocation || state.selectedLocation;
    
    setState((prev) => ({ ...prev, isGenerating: true, error: null, resultImage: null }));

    try {
      const result = await generatePhoto(state.images, finalLocation, state.selectedCostume);
      setState((prev) => ({ ...prev, resultImage: result, isGenerating: false }));
    } catch (err: any) {
      setState((prev) => ({ 
        ...prev, 
        isGenerating: false, 
        error: "Failed to generate photo. Please try again." 
      }));
    }
  };

  const reset = () => {
    setState({
      images: [],
      selectedLocation: LOCATIONS[0].name,
      customLocation: '',
      selectedCostume: COSTUMES[0].name,
      isGenerating: false,
      resultImage: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-indigo-900">VietPhoto AI</h1>
              <p className="text-xs text-slate-500 font-medium">Professional Ethnic Makeover</p>
            </div>
          </div>
          {state.resultImage && (
             <button 
              onClick={reset}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {!state.resultImage ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <div className="md:col-span-7 space-y-8">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">1</span>
                  <h2 className="text-lg font-semibold">Upload Your Photo</h2>
                </div>
                
                <label className="group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-slate-500 font-medium group-hover:text-indigo-600 transition-colors">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400">PNG, JPG or JPEG (Max 10MB)</p>
                  </div>
                  <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
                </label>

                {state.images.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {state.images.map((img, idx) => (
                      <div key={idx} className="relative flex-shrink-0">
                        <img src={img} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                        <button 
                          onClick={() => setState(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">2</span>
                  <h2 className="text-lg font-semibold text-slate-800">Choose Destination</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Region & Location</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={state.selectedLocation}
                      onChange={(e) => setState(p => ({ ...p, selectedLocation: e.target.value }))}
                    >
                      <optgroup label="Miền Bắc">
                        {LOCATIONS.filter(l => l.region === 'North').map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                      </optgroup>
                      <optgroup label="Miền Trung">
                        {LOCATIONS.filter(l => l.region === 'Central').map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                      </optgroup>
                      <optgroup label="Miền Nam">
                        {LOCATIONS.filter(l => l.region === 'South').map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Or Enter Custom Destination</label>
                    <input 
                      type="text"
                      placeholder="e.g. Vịnh Hạ Long"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={state.customLocation}
                      onChange={(e) => setState(p => ({ ...p, customLocation: e.target.value }))}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">3</span>
                  <h2 className="text-lg font-semibold text-slate-800">Select Costume</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COSTUMES.map((costume) => (
                    <button
                      key={costume.id}
                      onClick={() => setState(p => ({ ...p, selectedCostume: costume.name }))}
                      className={`px-3 py-4 rounded-xl border text-center transition-all ${
                        state.selectedCostume === costume.name 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600' 
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-50">{costume.ethnicGroup}</span>
                      <span className="text-sm font-semibold leading-tight">{costume.name.replace('Trang phục ', '')}</span>
                    </button>
                  ))}
                </div>
              </section>

              <button
                disabled={state.isGenerating || state.images.length === 0}
                onClick={handleGenerate}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-3 ${
                  state.isGenerating || state.images.length === 0
                    ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {state.isGenerating ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating Masterpiece...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 21v-3.5"/><path d="M9 21v-3.5"/><path d="M13 21v-3.5"/><path d="M17 21v-3.5"/><path d="M21 21v-3.5"/></svg>
                    Create My AI Photo
                  </>
                )}
              </button>

              {state.error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100 text-sm font-medium animate-bounce">
                  {state.error}
                </div>
              )}
            </div>

            {/* Right Column: Information/Sidebars */}
            <div className="md:col-span-5 space-y-8">
              <div className="bg-indigo-900 text-indigo-100 p-6 rounded-2xl shadow-xl overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
                <h3 className="text-xl font-bold mb-4 text-white relative z-10">How it works</h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded text-xs flex items-center justify-center font-bold">1</div>
                    <p className="text-sm">Upload a portrait photo with clear facial features.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded text-xs flex items-center justify-center font-bold">2</div>
                    <p className="text-sm">Select a stunning Vietnamese destination from our curated list.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded text-xs flex items-center justify-center font-bold">3</div>
                    <p className="text-sm">Choose an ethnic costume to transform your look.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded text-xs flex items-center justify-center font-bold">4</div>
                    <p className="text-sm">Our AI generates a high-quality cinematic composite in seconds.</p>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4">Popular Combos</h3>
                <div className="space-y-3">
                  {[
                    { loc: 'Sa Pa', attire: 'H\'Mông', img: 'https://picsum.photos/seed/sapa/400/300' },
                    { loc: 'Phú Quốc', attire: 'Khmer', img: 'https://picsum.photos/seed/pq/400/300' },
                    { loc: 'Sơn Đoòng', attire: 'Mường', img: 'https://picsum.photos/seed/sd/400/300' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                      <img src={item.img} className="w-12 h-12 rounded-lg object-cover" alt="Combo" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.loc}</p>
                        <p className="text-xs text-slate-500">Wearing {item.attire}</p>
                      </div>
                      <svg className="ml-auto w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Result View */
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
               <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 group">
                  <img src={state.resultImage} alt="Generated result" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-xs font-medium uppercase tracking-widest opacity-80 mb-1">Created with VietPhoto AI</p>
                    <h3 className="text-2xl font-bold">{state.customLocation || state.selectedLocation}</h3>
                    <p className="text-sm font-medium text-indigo-200">Wearing {state.selectedCostume}</p>
                  </div>
               </div>
               
               <div className="p-6 grid grid-cols-2 gap-4">
                  <button 
                    onClick={reset}
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Try Another
                  </button>
                  <a 
                    href={state.resultImage} 
                    download="viet-photo-ai.png"
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Save Photo
                  </a>
               </div>
            </div>
            
            <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Photo Tip</h4>
                <p className="text-sm text-amber-800 opacity-90">This AI-generated image works best when you share it on social media! Tag us at #VietPhotoAI to show off your ethnic transformation.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs">
        <p>&copy; 2024 VietPhoto AI. All rights reserved. Powered by Google Gemini.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-500 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
