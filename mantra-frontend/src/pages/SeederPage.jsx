import { useState } from "react";
import { articleAPI, originAPI, categoryAPI } from "../services/articleService";
import { useAuth } from "../context/AuthContext";

export default function SeederPage() {
    const { isAuthenticated } = useAuth();
    const [status, setStatus] = useState("Ready");
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => setLogs(p => [...p, msg]);

    const dummyArticles = [
        {
            title: "The Future of AI in Healthcare",
            summary: "Artificial Intelligence is revolutionizing how we diagnose and treat diseases. From predictive analytics to robotic surgery, the possibilities are endless.",
            content: "<p>Artificial Intelligence is revolutionizing how we diagnose and treat diseases...</p>",
            thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
            readingTime: 5,
            tags: ["AI", "Health", "Tech"]
        },
        {
            title: "Sustainable Living: Small Changes, Big Impact",
            summary: "Discover how simple daily habits can contribute to a greener planet. Learn about composting, reducing plastic, and conscious consumption.",
            content: "<p>Discover how simple daily habits can contribute to a greener planet...</p>",
            thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
            readingTime: 4,
            tags: ["Sustainability", "Environment", "Lifestyle"]
        },
        {
            title: "Space Exploration: Mars and Beyond",
            summary: "NASA and SpaceX are racing to get humans to Mars. What are the challenges and when can we expect the first boots on the Red Planet?",
            content: "<p>NASA and SpaceX are racing to get humans to Mars...</p>",
            thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
            readingTime: 8,
            tags: ["Space", "Science", "Mars"]
        },
        {
            title: "Minimalist Design Trends 2024",
            summary: "Less is more. Explore the clean lines, neutral palettes, and functional aesthetics dominating the design world this year.",
            content: "<p>Less is more. Explore the clean lines...</p>",
            thumbnail: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
            readingTime: 3,
            tags: ["Design", "Minimalism", "Trends"]
        },
        {
            title: "The Rise of Remote Work Culture",
            summary: "How remote work is reshaping urban landscapes, office dynamics, and work-life balance for employees around the globe.",
            content: "<p>How remote work is reshaping urban landscapes...</p>",
            thumbnail: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=800&q=80",
            readingTime: 6,
            tags: ["Work", "Remote", "Culture"]
        }
    ];

    const handleSeed = async () => {
        if (!isAuthenticated) {
            setStatus("Please login first");
            return;
        }

        try {
            setStatus("Fetching metadata...");
            const [originsRes, catsRes] = await Promise.all([
                originAPI.getAll(),
                categoryAPI.getAll()
            ]);

            const origins = originsRes.data;
            const categories = catsRes.data;

            if (!origins.length || !categories.length) {
                setStatus("Error: No origins or categories found in DB. Cannot seed articles.");
                return;
            }

            addLog(`Found ${origins.length} origins and ${categories.length} categories.`);

            for (const article of dummyArticles) {
                setStatus(`Creating: ${article.title}...`);

                // Pick random origin and category
                const originId = origins[Math.floor(Math.random() * origins.length)].id;
                const categoryId = categories[Math.floor(Math.random() * categories.length)].id;

                await articleAPI.create({
                    ...article,
                    originId,
                    categoryId
                });
                addLog(`✅ Created: ${article.title}`);
            }

            setStatus("Seeding Complete!");
        } catch (err) {
            console.error(err);
            setStatus(`Error: ${err.message}`);
            addLog(`❌ Failed: ${err.message}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
            <div className="mb-4">
                <p className="mb-2">Status: <span className="font-mono font-bold">{status}</span></p>
                <button
                    onClick={handleSeed}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Seed Dummy Data
                </button>
            </div>
            <div className="bg-slate-100 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
}
