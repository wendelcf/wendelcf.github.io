
import React, { useState } from 'react';
import { PROMPT_GUIDE, EDIT_GUIDE, KEYWORDS, NEGATIVE_PROMPTS } from '../constants/promptHelperData';
import { XCircleIcon, SparklesIcon } from './icons';
import Spinner from './Spinner';

interface PromptHelperModalProps {
  onClose: () => void;
  currentPrompt: string;
  onApplyPrompt: (prompt: string) => void;
  buildCreativePrompt: (keywords: string) => Promise<string>;
}

type Tab = 'Guide' | 'Editing' | 'Builder' | 'Styles' | 'Negative';
type Language = 'en' | 'pt-br';

const PromptHelperModal: React.FC<PromptHelperModalProps> = ({ onClose, currentPrompt, onApplyPrompt, buildCreativePrompt }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Guide');
  const [lang, setLang] = useState<Language>('en');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'Guide', label: 'Prompt Guide' },
    { id: 'Editing', label: 'Editing Guide' },
    { id: 'Builder', label: 'Prompt Builder' },
    { id: 'Styles', label: 'Styles & Keywords' },
    { id: 'Negative', label: 'Negative Prompts' },
  ];

  const addToPrompt = (text: string) => {
    onApplyPrompt((currentPrompt ? currentPrompt + ', ' : '') + text);
  };

  const PromptBuilder: React.FC = () => {
    const [inputs, setInputs] = useState({ type: '', subject: '', style: '', details: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setResult('');
        const keywords = Object.entries(inputs)
            .filter(([, value]) => value.trim() !== '')
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        
        try {
            const newPrompt = await buildCreativePrompt(keywords);
            setResult(newPrompt);
        } catch (error) {
            setResult('Sorry, could not build a prompt. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400">AI Prompt Builder</h3>
            <p>Describe the key elements, and we'll generate a creative prompt for you.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Type (e.g., photo, illustration)" value={inputs.type} onChange={e => setInputs({...inputs, type: e.target.value})} className="input-style" />
                <input type="text" placeholder="Subject (e.g., astronaut on a horse)" value={inputs.subject} onChange={e => setInputs({...inputs, subject: e.target.value})} className="input-style" />
                <input type="text" placeholder="Style (e.g., cinematic, synthwave)" value={inputs.style} onChange={e => setInputs({...inputs, style: e.target.value})} className="input-style" />
                <input type="text" placeholder="Other Details (e.g., neon lighting)" value={inputs.details} onChange={e => setInputs({...inputs, details: e.target.value})} className="input-style" />
            </div>
            <button onClick={handleGenerate} disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                {isLoading ? <Spinner/> : <SparklesIcon />}
                {isLoading ? 'Building...' : 'Build Prompt'}
            </button>
            {result && (
                <div className="bg-slate-900 p-4 rounded-md">
                    <p className="font-mono text-slate-300">{result}</p>
                    <button onClick={() => onApplyPrompt(result)} className="btn-secondary mt-2 w-full">Use This Prompt</button>
                </div>
            )}
        </div>
    );
};


  const renderContent = () => {
    switch (activeTab) {
      case 'Guide': return (
        <div className="space-y-4 prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-cyan-400">
            <h3 className="text-xl font-bold">{PROMPT_GUIDE[lang].title}</h3>
            <p>{PROMPT_GUIDE[lang].description}</p>
            <h4 className="font-semibold">{PROMPT_GUIDE[lang].structure.title}</h4>
            <ul>{PROMPT_GUIDE[lang].structure.parts.map(p => <li key={p}><strong>{p.split(':')[0]}:</strong>{p.split(':')[1]}</li>)}</ul>
            <h4 className="font-semibold">{PROMPT_GUIDE[lang].example.title}</h4>
            <pre className="bg-slate-900 p-3 rounded-md font-mono text-sm"><code>{PROMPT_GUIDE[lang].example.prompt}</code></pre>
            <p>{PROMPT_GUIDE[lang].example.explanation}</p>
        </div>
      );
      case 'Editing': return (
        <div className="space-y-4 prose prose-invert max-w-none">
          <h3 className="text-xl font-bold text-cyan-400">{EDIT_GUIDE[lang].title}</h3>
          {EDIT_GUIDE[lang].sections.map(sec => (
            <div key={sec.title} className="bg-slate-700/50 p-4 rounded-lg">
              <h4 className="font-semibold">{sec.title}</h4>
              <p className="text-sm text-slate-300">{sec.description}</p>
              <button onClick={() => addToPrompt(sec.template)} className="mt-2 text-xs bg-cyan-800 hover:bg-cyan-700 p-1 px-2 rounded">Add Template</button>
              <pre className="mt-2 bg-slate-900 p-2 rounded-md font-mono text-xs text-slate-400"><code>Template: {sec.template}</code></pre>
            </div>
          ))}
        </div>
      );
      case 'Builder': return <PromptBuilder />;
      case 'Styles': return (
          <div className="space-y-6">
              {Object.entries(KEYWORDS).map(([category, items]) => (
                  <div key={category}>
                      <h4 className="font-semibold text-cyan-400 mb-2">{KEYWORDS[category][lang].title}</h4>
                      <div className="flex flex-wrap gap-2">
                          {KEYWORDS[category].items.map(item => (
                              <button key={item.en} onClick={() => addToPrompt(item.en)} className="keyword-btn">
                                  {item[lang]}
                              </button>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      );
      case 'Negative': return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-cyan-400">{NEGATIVE_PROMPTS[lang].title}</h3>
            <p>{NEGATIVE_PROMPTS[lang].description}</p>
            <div className="flex flex-wrap gap-2">
                {NEGATIVE_PROMPTS.keywords.map(kw => (
                    <button key={kw.en} onClick={() => onApplyPrompt((currentPrompt ? currentPrompt + ', ' : '') + kw.en)} className="keyword-btn">
                        {kw[lang]}
                    </button>
                ))}
            </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <style>{`
        .prose strong { color: #A5F3FC; }
        .input-style { background-color: #334155; border: 1px solid #475569; border-radius: 0.375rem; padding: 0.75rem; width: 100%; transition: all 0.2s; }
        .input-style:focus { ring: 2px; ring-color: #06b6d4; border-color: #06b6d4; }
        .btn-primary { background-color: #0891b2; color: white; font-weight: bold; padding: 0.75rem 1rem; border-radius: 0.375rem; transition: background-color 0.2s; }
        .btn-primary:hover { background-color: #06b6d4; }
        .btn-primary:disabled { background-color: #475569; cursor: not-allowed; }
        .btn-secondary { background-color: #475569; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 0.375rem; transition: background-color 0.2s; }
        .btn-secondary:hover { background-color: #64748b; }
        .keyword-btn { background-color: #475569; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; transition: background-color 0.2s; }
        .keyword-btn:hover { background-color: #64748b; }
      `}</style>
      <div className="bg-slate-800 w-full max-w-4xl h-full max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
             <SparklesIcon className="w-6 h-6 text-cyan-400"/>
             <h2 className="text-2xl font-bold">Prompt Helper</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-700 p-1 rounded-lg flex text-sm">
                <button onClick={() => setLang('en')} className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-cyan-600' : ''}`}>EN</button>
                <button onClick={() => setLang('pt-br')} className={`px-2 py-1 rounded ${lang === 'pt-br' ? 'bg-cyan-600' : ''}`}>PT-BR</button>
            </div>
            <button onClick={onClose}><XCircleIcon className="w-8 h-8 text-slate-400 hover:text-white"/></button>
          </div>
        </div>
        <div className="flex flex-grow overflow-hidden">
            <nav className="w-48 border-r border-slate-700 p-2 flex flex-col gap-1">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left p-2 rounded-md font-semibold text-sm ${activeTab === tab.id ? 'bg-cyan-600 text-white' : 'hover:bg-slate-700'}`}>
                        {tab.label}
                    </button>
                ))}
            </nav>
            <div className="flex-grow p-6 overflow-y-auto text-slate-300">
                {renderContent()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PromptHelperModal;
