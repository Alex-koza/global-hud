import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), `app/[locale]/blog/${slug}.md`);
    if (!fs.existsSync(filePath)) return { title: 'Not Found' };

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

    return {
        title: `${data.title} | Global HUD Blog`,
        description: `Read the declassified report on ${data.title}.`,
        openGraph: {
            title: data.title,
            type: 'article',
            article: { publishedTime: data.date, authors: [data.author] }
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), `app/[locale]/blog/${slug}.md`);

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return (
        <div className="min-h-screen bg-[#05080f] text-[#00f0ff] font-mono p-4 md:p-8 select-none relative overflow-auto custom-scrollbar">
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none fixed" />

            <div className="w-full max-w-3xl mx-auto relative z-10 mt-8 mb-20 bg-[#00f0ff]/5 border border-[#00f0ff]/30 p-8 md:p-12 shadow-[0_0_20px_rgba(0,240,255,0.1)]">

                <Link href="/blog" className="inline-flex items-center text-xs uppercase tracking-widest text-[#00f0ff]/70 hover:text-[#00f0ff] transition-colors mb-8">
                    <ArrowLeft size={14} className="mr-2" /> RETURN TO TRANSMISSIONS
                </Link>

                {/* Article Meta */}
                <div className="mb-10 text-center border-b border-[#00f0ff]/30 pb-8">
                    <div className="flex justify-center mb-4">
                        <ShieldCheck size={40} className="text-[#00f0ff]" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-widest uppercase mb-4 leading-tight">
                        {data.title}
                    </h1>
                    <div className="flex justify-center items-center gap-4 text-xs tracking-widest opacity-70 uppercase">
                        <span>AUTH: {data.author}</span>
                        <span>//</span>
                        <span>DATE: {data.date}</span>
                        <span>//</span>
                        <span>CAT: {data.category}</span>
                    </div>
                </div>

                {/* Markdown Content rendered as HTML */}
                <div
                    className="prose prose-invert prose-p:text-[#00f0ff]/80 prose-headings:text-[#00f0ff] prose-a:text-[#ff0033] prose-strong:text-white max-w-none font-mono"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />

                <div className="mt-16 pt-4 border-t border-[#ff0033]/30 text-center text-[10px] text-[#ff0033]/50">
                    END OF TRANSMISSION
                </div>
            </div>
        </div>
    );
}
