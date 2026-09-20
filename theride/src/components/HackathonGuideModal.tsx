import React, { useState } from 'react';
import { 
  BookOpen, 
  Cloud, 
  Terminal, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  Server, 
  Database, 
  Lock, 
  Cpu, 
  Sparkles, 
  X,
  ExternalLink,
  ChevronRight,
  Download
} from 'lucide-react';

interface HackathonGuideModalProps {
  onClose: () => void;
}

export const HackathonGuideModal: React.FC<HackathonGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'terms' | 'architecture' | 'roadmap'>('overview');

  const termsDictionary = [
    {
      term: 'AWS Lambda',
      simple: 'Serverless Functions',
      desc: 'Runs backend code only when a user requests it (like booking a driver). Zero cost when nobody is clicking.',
      track: 'Deployed'
    },
    {
      term: 'Amazon DynamoDB',
      simple: 'Lightning Fast NoSQL Database',
      desc: 'Stores driver profiles, user details, and active ride logs with millisecond response times.',
      track: 'Deployed'
    },
    {
      term: 'AWS Amplify Hosting',
      simple: 'One-Click Frontend Deployment',
      desc: 'Takes your React/Vite web application and gives you a live HTTPS public URL in 2 minutes.',
      track: 'Deployed'
    },
    {
      term: 'Amazon S3',
      simple: 'Cloud Storage Bucket',
      desc: 'Stores vehicle photos, driver driving licenses (DL), and inspection walkaround pictures.',
      track: 'Deployed'
    },
    {
      term: 'Amazon Bedrock',
      simple: 'Managed Generative AI Service',
      desc: 'Provides foundation AI models (Claude, Titan) to power smart driver matching or assistant chat.',
      track: 'Deployed'
    },
    {
      term: 'Amazon Cognito',
      simple: 'User Authentication & Login',
      desc: 'Handles phone number OTP login and security credentials for customers and drivers.',
      track: 'Deployed'
    },
    {
      term: 'LocalStack',
      simple: 'Fake AWS on your own laptop',
      desc: 'Emulates AWS services locally on your machine without needing an AWS account or credit card.',
      track: 'Open Source'
    },
    {
      term: 'PartyRock',
      simple: 'No-Code AI Playground in Browser',
      desc: 'Amazon Bedrock-powered tool to rapidly assemble generative AI widgets without writing code.',
      track: 'Open Source'
    },
    {
      term: 'Cedar',
      simple: 'Authorization Policy Engine',
      desc: 'Expresses permissions rules in clean policies (e.g., "Only the assigned driver can read car OTP").',
      track: 'Open Source'
    },
    {
      term: 'SAM CLI',
      simple: 'Serverless Application Model',
      desc: 'Command-line tool to test and package serverless code locally on your computer.',
      track: 'Open Source'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs shrink-0">
              AWS
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Hackathon Master Guide: "First Commit | Bharat Builds"
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Requirements, platform selection, AWS term breakdowns, and project architecture
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-3 sm:px-5 gap-2 sm:gap-4 overflow-x-auto scrollbar-none whitespace-nowrap">
          {[
            { id: 'overview', label: '1. What To Do' },
            { id: 'terms', label: '2. Screenshot Terms' },
            { id: 'architecture', label: '3. App Architecture' },
            { id: 'roadmap', label: '4. Pitch & Submission' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-1 text-xs font-semibold border-b-2 transition-all min-h-[44px] shrink-0 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                <h4 className="font-bold text-sm mb-1">Hackathon Theme: "Build Something That Solves a Real Problem"</h4>
                <p className="text-xs leading-relaxed">
                  Your idea (<strong>"An app to book drivers to drive the user's personal vehicle"</strong>) is an <em>exceptional</em> real-world fit! It directly solves critical safety and community issues:
                </p>
                <ul className="list-disc list-inside text-xs mt-2 space-y-1 font-medium">
                  <li><strong>Drunk driving prevention:</strong> Partiers can take their own car and hire a verified chauffeur to drive them home safely.</li>
                  <li><strong>Elderly and hospital transportation:</strong> Relieves stressful parking and heavy city traffic for seniors.</li>
                  <li><strong>Highway fatigue relief:</strong> Drivers take over for long outstation trips in the owner's comfortable car.</li>
                </ul>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">Which Track Should You Choose?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Track 1: Open Source on Local Machine</span>
                  <div className="text-xs text-slate-600">
                    <strong>Best if:</strong> You don't have an AWS cloud account or credit card.
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>How it works:</strong> You run your app locally using <em>LocalStack</em> (simulated AWS) or build an interactive agent with <em>PartyRock</em>.
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Track 2: Deployed with a URL (Recommended!)</span>
                  <div className="text-xs text-slate-600">
                    <strong>Best if:</strong> You want a live link to show the judges (e.g. AWS Amplify Hosting).
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Free Credits:</strong> The hackathon organizers provide free AWS credits so you won't be charged.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS DICTIONARY */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Here is what every single service and acronym in the screenshot actually means, explained in everyday plain English:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {termsDictionary.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{item.term}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        item.track === 'Deployed' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.track}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-blue-600">{item.simple}</div>
                    <p className="text-[11px] text-slate-600 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ARCHITECTURE MAPPING */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                To impress the hackathon judges, showcase this clean AWS cloud architecture for your Vehicle Driver Booking app:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">1. Frontend UI (This Web App)</div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Built in React + Vite + Tailwind CSS. Hosted on <strong>AWS Amplify Hosting</strong> to get a live, custom HTTPS domain with auto-build CI/CD from GitHub.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 shrink-0">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">2. API & Business Logic</div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong>Amazon API Gateway + AWS Lambda</strong> handle endpoints: <code>/book-driver</code>, <code>/estimate-fare</code>, <code>/verify-otp</code>. Costs $0 when idle.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">3. Database & Storage</div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong>Amazon DynamoDB</strong> stores driver records, vehicle details, and active ride telemetry. <strong>Amazon S3</strong> stores pre-ride vehicle condition photos and driver KYC documents.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">4. GenAI Feature (Bonus Points)</div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Using <strong>Amazon Bedrock</strong> (Titan or Claude) for intelligent route risk assessment, weather warnings, and automated driver match optimization based on car transmission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PITCH TIPS */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">How to Present This at the Hackathon</h4>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Problem Statement:</strong> Millions of people own cars but face situations where they cannot or should not drive (late-night parties, medical appointments, intense highway fatigue, unfamiliarity with manual gearboxes).
                  </div>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Unique Selling Point (Personal Vehicle Trust):</strong> Unlike Uber/Ola which send a taxi, our app provides <em>only the verified chauffeur</em> to drive the customer's own car. Includes digital inspection and OTP key handover for 100% peace of mind.
                  </div>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Live Demonstration:</strong> Walk the judges through the live flow: selecting vehicle type, picking an hourly package, matching a background-checked driver, viewing simulated GPS tracking, and safety SOS protocol.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Current prototype is fully functional and ready for deployment.
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <a
              href="/theride-source-code.zip"
              download="theride-source-code.zip"
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-xl transition-colors"
              title="Download project code as ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project ZIP</span>
            </a>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
            >
              Got It, Back to App
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
