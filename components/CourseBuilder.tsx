'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PhotoIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type ModuleType = 'introduction' | 'drag-drop' | 'multiple-choice' | 'code-question';

interface CourseModule {
  id: string;
  type: ModuleType;
  title: string;
  content: any;
  order: number;
}

interface Course {
  id: string;
  name: string;
  description: string;
  modules: CourseModule[];
  createdAt: Date;
  updatedAt: Date;
}

interface IntroductionContent {
  text: string;
  icon: string;
  image?: string;
  backgroundColor: string;
}

interface DragDropContent {
  question: string;
  items: { id: string; text: string; }[];
  dropZones: { id: string; label: string; correctItems: string[]; }[];
  instructions: string;
}

interface MultipleChoiceContent {
  question: string;
  options: { id: string; text: string; isCorrect: boolean; }[];
  explanation: string;
  timeLimit?: number;
}

interface CodeQuestionContent {
  question: string;
  initialCode: string;
  expectedOutput: string;
  language: string;
  hints: string[];
  testCases: { input: string; expectedOutput: string; }[];
}

export default function CourseBuilder() {
  const { user } = useUser();
  const [course, setCourse] = useState<Course>({
    id: '',
    name: '',
    description: '',
    modules: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const moduleTypes = [
    {
      type: 'introduction' as ModuleType,
      name: 'Introduction & Background',
      icon: DocumentTextIcon,
      description: 'Add text content with icons and images',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'drag-drop' as ModuleType,
      name: 'Drag & Drop Quiz',
      icon: CursorArrowRaysIcon,
      description: 'Interactive drag and drop exercises',
      color: 'from-green-500 to-emerald-500'
    },
    {
      type: 'multiple-choice' as ModuleType,
      name: 'Multiple Choice',
      icon: QuestionMarkCircleIcon,
      description: 'Multiple choice questions with explanations',
      color: 'from-purple-500 to-pink-500'
    },
    {
      type: 'code-question' as ModuleType,
      name: 'Code Challenge',
      icon: CodeBracketIcon,
      description: 'Programming questions with code editor',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const addModule = (type: ModuleType) => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      type,
      title: `New ${moduleTypes.find(t => t.type === type)?.name}`,
      content: getDefaultContent(type),
      order: course.modules.length
    };
    
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModule],
      updatedAt: new Date()
    }));
    
    setActiveModule(newModule.id);
  };

  const getDefaultContent = (type: ModuleType) => {
    switch (type) {
      case 'introduction':
        return {
          text: 'Enter your introduction text here...',
          icon: '📚',
          backgroundColor: '#f0f9ff'
        } as IntroductionContent;
      case 'drag-drop':
        return {
          question: 'Drag the items to the correct zones',
          items: [{ id: 'item1', text: 'Item 1' }],
          dropZones: [{ id: 'zone1', label: 'Zone 1', correctItems: ['item1'] }],
          instructions: 'Drag and drop instructions'
        } as DragDropContent;
      case 'multiple-choice':
        return {
          question: 'Enter your question here',
          options: [
            { id: 'opt1', text: 'Option 1', isCorrect: true },
            { id: 'opt2', text: 'Option 2', isCorrect: false }
          ],
          explanation: 'Explanation for the correct answer'
        } as MultipleChoiceContent;
      case 'code-question':
        return {
          question: 'Write a function that...',
          initialCode: '// Write your code here\nfunction solution() {\n  \n}',
          expectedOutput: 'Expected output',
          language: 'javascript',
          hints: ['Hint 1'],
          testCases: [{ input: 'test input', expectedOutput: 'expected output' }]
        } as CodeQuestionContent;
      default:
        return {};
    }
  };

  const updateModule = (moduleId: string, updates: Partial<CourseModule>) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module => 
        module.id === moduleId ? { ...module, ...updates } : module
      ),
      updatedAt: new Date()
    }));
  };

  const deleteModule = (moduleId: string) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== moduleId),
      updatedAt: new Date()
    }));
    if (activeModule === moduleId) {
      setActiveModule(null);
    }
  };

  const moveModule = (moduleId: string, direction: 'up' | 'down') => {
    const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const newModules = [...course.modules];
    const targetIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < newModules.length) {
      [newModules[moduleIndex], newModules[targetIndex]] = [newModules[targetIndex], newModules[moduleIndex]];
      
      setCourse(prev => ({
        ...prev,
        modules: newModules.map((module, index) => ({ ...module, order: index })),
        updatedAt: new Date()
      }));
    }
  };

  const saveCourse = async () => {
    try {
      // Here you would typically save to your database
      console.log('Saving course:', course);
      alert('Course saved successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    }
  };

  const renderModuleEditor = (module: CourseModule) => {
    switch (module.type) {
      case 'introduction':
        return <IntroductionEditor module={module} updateModule={updateModule} />;
      case 'drag-drop':
        return <DragDropEditor module={module} updateModule={updateModule} />;
      case 'multiple-choice':
        return <MultipleChoiceEditor module={module} updateModule={updateModule} />;
      case 'code-question':
        return <CodeQuestionEditor module={module} updateModule={updateModule} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Course Builder
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Create interactive learning experiences</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  previewMode
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <EyeIcon className="h-5 w-5 inline mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
              <button
                onClick={saveCourse}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Save Course
              </button>
            </div>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={course.name}
                onChange={(e) => setCourse(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course name..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Course Description
              </label>
              <textarea
                value={course.description}
                onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course description..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Module Types & List */}
          <div className="xl:col-span-1 space-y-6">
            {/* Add Module Types */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Add Module</h2>
              <div className="space-y-3">
                {moduleTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.type}
                      onClick={() => addModule(type.type)}
                      className="w-full p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {type.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Module List */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Course Modules</h2>
              <div className="space-y-2">
                {course.modules.map((module, index) => {
                  const moduleType = moduleTypes.find(t => t.type === module.type);
                  const IconComponent = moduleType?.icon || DocumentTextIcon;
                  
                  return (
                    <div
                      key={module.id}
                      className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        activeModule === module.id
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                      onClick={() => setActiveModule(module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${moduleType?.color} flex items-center justify-center`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white text-sm">
                              {module.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {moduleType?.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveModule(module.id, 'up');
                            }}
                            disabled={index === 0}
                            className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ArrowUpIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveModule(module.id, 'down');
                            }}
                            disabled={index === course.modules.length - 1}
                            className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ArrowDownIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteModule(module.id);
                            }}
                            className="p-1 rounded text-red-400 hover:text-red-600"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {course.modules.length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <BookOpenIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No modules added yet</p>
                    <p className="text-sm">Click on a module type to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module Editor */}
          <div className="xl:col-span-2">
            {activeModule ? (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                {renderModuleEditor(course.modules.find(m => m.id === activeModule)!)}
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <div className="text-center py-16">
                  <BookOpenIcon className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    Select a Module to Edit
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Choose a module from the list or add a new one to start building your course
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Module Editor Components
function IntroductionEditor({ module, updateModule }: { module: CourseModule; updateModule: (id: string, updates: Partial<CourseModule>) => void }) {
  const content = module.content as IntroductionContent;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Introduction & Background</h3>
        <DocumentTextIcon className="h-6 w-6 text-blue-500" />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Module Title
        </label>
        <input
          type="text"
          value={module.title}
          onChange={(e) => updateModule(module.id, { title: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Content Text
        </label>
        <textarea
          value={content.text}
          onChange={(e) => updateModule(module.id, { content: { ...content, text: e.target.value } })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={6}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Icon (Emoji)
          </label>
          <input
            type="text"
            value={content.icon}
            onChange={(e) => updateModule(module.id, { content: { ...content, icon: e.target.value } })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="📚"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Background Color
          </label>
          <input
            type="color"
            value={content.backgroundColor}
            onChange={(e) => updateModule(module.id, { content: { ...content, backgroundColor: e.target.value } })}
            className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-600"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Image URL (Optional)
        </label>
        <input
          type="url"
          value={content.image || ''}
          onChange={(e) => updateModule(module.id, { content: { ...content, image: e.target.value } })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      {/* Preview */}
      <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Preview</h4>
        <div 
          className="p-6 rounded-xl border border-slate-200 dark:border-slate-600"
          style={{ backgroundColor: content.backgroundColor }}
        >
          <div className="flex items-start space-x-4">
            <div className="text-4xl">{content.icon}</div>
            <div className="flex-1">
              <h5 className="text-xl font-bold text-slate-800 mb-2">{module.title}</h5>
              <p className="text-slate-700 whitespace-pre-wrap">{content.text}</p>
              {content.image && (
                <img 
                  src={content.image} 
                  alt="Module image" 
                  className="mt-4 max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '200px' }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DragDropEditor({ module, updateModule }: { module: CourseModule; updateModule: (id: string, updates: Partial<CourseModule>) => void }) {
  const content = module.content as DragDropContent;
  
  const addItem = () => {
    const newItem = { id: `item-${Date.now()}`, text: 'New Item' };
    updateModule(module.id, {
      content: {
        ...content,
        items: [...content.items, newItem]
      }
    });
  };
  
  const addDropZone = () => {
    const newZone = { id: `zone-${Date.now()}`, label: 'New Zone', correctItems: [] };
    updateModule(module.id, {
      content: {
        ...content,
        dropZones: [...content.dropZones, newZone]
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Drag & Drop Quiz</h3>
        <CursorArrowRaysIcon className="h-6 w-6 text-green-500" />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Module Title
        </label>
        <input
          type="text"
          value={module.title}
          onChange={(e) => updateModule(module.id, { title: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Question
        </label>
        <textarea
          value={content.question}
          onChange={(e) => updateModule(module.id, { content: { ...content, question: e.target.value } })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Instructions
        </label>
        <textarea
          value={content.instructions}
          onChange={(e) => updateModule(module.id, { content: { ...content, instructions: e.target.value } })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
        />
      </div>
      
      {/* Draggable Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Draggable Items
          </label>
          <button
            onClick={addItem}
            className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            <PlusIcon className="h-4 w-4 inline mr-1" />
            Add Item
          </button>
        </div>
        
        <div className="space-y-2">
          {content.items.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2">
              <input
                type="text"
                value={item.text}
                onChange={(e) => {
                  const updatedItems = content.items.map(i => 
                    i.id === item.id ? { ...i, text: e.target.value } : i
                  );
                  updateModule(module.id, { content: { ...content, items: updatedItems } });
                }}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              <button
                onClick={() => {
                  const updatedItems = content.items.filter(i => i.id !== item.id);
                  updateModule(module.id, { content: { ...content, items: updatedItems } });
                }}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Drop Zones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Drop Zones
          </label>
          <button
            onClick={addDropZone}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="h-4 w-4 inline mr-1" />
            Add Zone
          </button>
        </div>
        
        <div className="space-y-4">
          {content.dropZones.map((zone) => (
            <div key={zone.id} className="p-4 border border-slate-200 dark:border-slate-600 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={zone.label}
                  onChange={(e) => {
                    const updatedZones = content.dropZones.map(z => 
                      z.id === zone.id ? { ...z, label: e.target.value } : z
                    );
                    updateModule(module.id, { content: { ...content, dropZones: updatedZones } });
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white mr-2"
                  placeholder="Zone label"
                />
                <button
                  onClick={() => {
                    const updatedZones = content.dropZones.filter(z => z.id !== zone.id);
                    updateModule(module.id, { content: { ...content, dropZones: updatedZones } });
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Correct Items (select which items belong in this zone)
                </label>
                <div className="space-y-1">
                  {content.items.map((item) => (
                    <label key={item.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={zone.correctItems.includes(item.id)}
                        onChange={(e) => {
                          const updatedZones = content.dropZones.map(z => {
                            if (z.id === zone.id) {
                              const correctItems = e.target.checked
                                ? [...z.correctItems, item.id]
                                : z.correctItems.filter(id => id !== item.id);
                              return { ...z, correctItems };
                            }
                            return z;
                          });
                          updateModule(module.id, { content: { ...content, dropZones: updatedZones } });
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MultipleChoiceEditor({ module, updateModule }: { module: CourseModule; updateModule: (id: string, updates: Partial<CourseModule>) => void }) {
  const content = module.content as MultipleChoiceContent;
  
  const addOption = () => {
    const newOption = { id: `opt-${Date.now()}`, text: 'New Option', isCorrect: false };
    updateModule(module.id, {
      content: {
        ...content,
        options: [...content.options, newOption]
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Multiple Choice Question</h3>
        <QuestionMarkCircleIcon className="h-6 w-6 text-purple-500" />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Module Title
        </label>
        <input
          type="text"
          value={module.title}
          onChange={(e) => updateModule(module.id, { title: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Question
        </label>
        <textarea
          value={content.question}
          onChange={(e) => updateModule(module.id, { content: { ...content, question: e.target.value } })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>
      
      {/* Options */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Answer Options
          </label>
          <button
            onClick={addOption}
            className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
          >
            <PlusIcon className="h-4 w-4 inline mr-1" />
            Add Option
          </button>
        </div>
        
        <div className="space-y-3">
          {content.options.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-600 rounded-xl">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`correct-${module.id}`}
                  checked={option.isCorrect}
                  onChange={() => {
                    const updatedOptions = content.options.map(opt => ({
                      ...opt,
                      isCorrect: opt.id === option.id
                    }));
                    updateModule(module.id, { content: { ...content, options: updatedOptions } });
                  }}
                  className="text-green-500"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">Correct</span>
              </div>
              
              <input
                type="text"
                value={option.text}
                onChange={(e) => {
                  const updatedOptions = content.options.map(opt => 
                    opt.id === option.id ? { ...opt, text: e.target.value } : opt
                  );
                  updateModule(module.id, { content: { ...content, options: updatedOptions } });
                }}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder={`Option ${index + 1}`}
              />
              
              <button
                onClick={() => {
                  const updatedOptions = content.options.filter(opt => opt.id !== option.id);
                  updateModule(module.id, { content: { ...content, options: updatedOptions } });
                }}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Explanation
        </label>
        <textarea
          value={content.explanation}
          onChange={(e) => updateModule(module.id, { content: { ...content, explanation: e.target.value } })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Explain why this is the correct answer..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Time Limit (seconds, optional)
        </label>
        <input
          type="number"
          value={content.timeLimit || ''}
          onChange={(e) => updateModule(module.id, { content: { ...content, timeLimit: e.target.value ? parseInt(e.target.value) : undefined } })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="60"
        />
      </div>
    </div>
  );
}

function CodeQuestionEditor({ module, updateModule }: { module: CourseModule; updateModule: (id: string, updates: Partial<CourseModule>) => void }) {
  const content = module.content as CodeQuestionContent;
  
  const addHint = () => {
    updateModule(module.id, {
      content: {
        ...content,
        hints: [...content.hints, 'New hint']
      }
    });
  };
  
  const addTestCase = () => {
    updateModule(module.id, {
      content: {
        ...content,
        testCases: [...content.testCases, { input: '', expectedOutput: '' }]
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Code Challenge</h3>
        <CodeBracketIcon className="h-6 w-6 text-orange-500" />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Module Title
        </label>
        <input
          type="text"
          value={module.title}
          onChange={(e) => updateModule(module.id, { title: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Question/Problem Description
        </label>
        <textarea
          value={content.question}
          onChange={(e) => updateModule(module.id, { content: { ...content, question: e.target.value } })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Programming Language
          </label>
          <select
            value={content.language}
            onChange={(e) => updateModule(module.id, { content: { ...content, language: e.target.value } })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Expected Output
          </label>
          <input
            type="text"
            value={content.expectedOutput}
            onChange={(e) => updateModule(module.id, { content: { ...content, expectedOutput: e.target.value } })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Initial Code Template
        </label>
        <textarea
          value={content.initialCode}
          onChange={(e) => updateModule(module.id, { content: { ...content, initialCode: e.target.value } })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          rows={8}
        />
      </div>
      
      {/* Hints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Hints
          </label>
          <button
            onClick={addHint}
            className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <PlusIcon className="h-4 w-4 inline mr-1" />
            Add Hint
          </button>
        </div>
        
        <div className="space-y-2">
          {content.hints.map((hint, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={hint}
                onChange={(e) => {
                  const updatedHints = content.hints.map((h, i) => 
                    i === index ? e.target.value : h
                  );
                  updateModule(module.id, { content: { ...content, hints: updatedHints } });
                }}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder={`Hint ${index + 1}`}
              />
              <button
                onClick={() => {
                  const updatedHints = content.hints.filter((_, i) => i !== index);
                  updateModule(module.id, { content: { ...content, hints: updatedHints } });
                }}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Test Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Test Cases
          </label>
          <button
            onClick={addTestCase}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="h-4 w-4 inline mr-1" />
            Add Test Case
          </button>
        </div>
        
        <div className="space-y-3">
          {content.testCases.map((testCase, index) => (
            <div key={index} className="p-4 border border-slate-200 dark:border-slate-600 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Test Case {index + 1}
                </span>
                <button
                  onClick={() => {
                    const updatedTestCases = content.testCases.filter((_, i) => i !== index);
                    updateModule(module.id, { content: { ...content, testCases: updatedTestCases } });
                  }}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Input
                  </label>
                  <input
                    type="text"
                    value={testCase.input}
                    onChange={(e) => {
                      const updatedTestCases = content.testCases.map((tc, i) => 
                        i === index ? { ...tc, input: e.target.value } : tc
                      );
                      updateModule(module.id, { content: { ...content, testCases: updatedTestCases } });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Expected Output
                  </label>
                  <input
                    type="text"
                    value={testCase.expectedOutput}
                    onChange={(e) => {
                      const updatedTestCases = content.testCases.map((tc, i) => 
                        i === index ? { ...tc, expectedOutput: e.target.value } : tc
                      );
                      updateModule(module.id, { content: { ...content, testCases: updatedTestCases } });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}