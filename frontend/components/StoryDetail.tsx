import React from 'react';
import { BlogPost } from '../types';

interface StoryDetailProps {
    post: BlogPost;
    onBack: () => void;
}

const StoryDetail: React.FC<StoryDetailProps> = ({ post, onBack }) => {
    return (
        <section className="py-20 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-gray-500 hover:text-green-700 font-bold mb-8 transition-colors"
                >
                    <span className="p-2 rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </span>
                    Back to News
                </button>

                <article className="animate-fade-in">
                    <header className="mb-12 text-center md:text-left">
                        <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full mb-6">
                            {post.category}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 text-sm font-semibold">
                            <div className="flex items-center gap-2">
                                <span className="p-1 bg-gray-100 rounded-md">👤</span>
                                <span>{post.author}</span>
                            </div>
                            <span className="hidden md:block w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                            <div className="flex items-center gap-2">
                                <span className="p-1 bg-gray-100 rounded-md">📅</span>
                                <span>{new Date(post.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </header>

                    {post.image && (
                        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 border-4 border-white">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-xl prose-green max-w-none text-gray-700 leading-relaxed
                        prose-headings:font-black prose-headings:text-gray-900 
                        prose-strong:text-gray-900 prose-strong:font-bold
                        prose-ul:list-disc prose-ul:pl-6
                        prose-li:my-2
                        prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:bg-green-50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic"
                        dangerouslySetInnerHTML={{ __html: post.body }}
                    />
                </article>
            </div>
        </section>
    );
};

export default StoryDetail;
