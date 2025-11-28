import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import MessageInput from './components/MessageInput';
import ConfirmationModal from './components/ConfirmationModal';
import SettingsModal from './components/SettingsModal';
import './App.css';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Helper function to detect name from introduction messages
const detectNameFromMessage = (message) => {
    const lowerMessage = message.toLowerCase().trim();

    // Blacklist common words that might be mistaken for names
    const commonWords = [
        'tadi', 'sudah', 'udah', 'lagi', 'mau', 'akan', 'bisa', 'boleh',
        'suka', 'cinta', 'benci', 'makan', 'minum', 'tidur', 'pergi',
        'pulang', 'kerja', 'main', 'belajar', 'disini', 'disitu', 'kemarin',
        'besok', 'nanti', 'sekarang', 'hari', 'ini', 'itu', 'yang', 'dan',
        'atau', 'tapi', 'karena', 'kalau', 'jika', 'bukan', 'jangan', 'tidak',
        'nggak', 'gak', 'belum', 'masih', 'sedang', 'baru', 'lama', 'cepat'
    ];

    // Various Indonesian introduction patterns - MORE STRICT
    const patterns = [
        /(?:kenalin|kenalan|perkenalkan)\s+(?:nama\s*)?(?:aku|saya|gw|gue)\s+(?:adalah\s+)?([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i,
        /(?:nama|namaku|nama\s+aku|nama\s+saya|nama\s+gw|nama\s+gue)\s+(?:adalah\s+)?([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i,
        /(?:panggil|sebut)\s+(?:aku|saya|gw|gue)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i,
        // Removed the loose "aku [name]" pattern as it causes too many false positives
    ];

    for (const pattern of patterns) {
        const match = lowerMessage.match(pattern);
        if (match && match[1]) {
            const detectedName = match[1].toLowerCase();

            // Check if detected name is a common word
            if (commonWords.includes(detectedName)) {
                continue;
            }

            // Capitalize first letter of each word
            const name = match[1]
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            return name;
        }
    }

    return null;
};

// Default bot configuration
const DEFAULT_BOT_NAME = 'Amumu';
const DEFAULT_BOT_AVATAR = '/amumu-avatar.png';
const DEFAULT_BOT_PERSONALITY = `Kamu adalah chatbot yang sangat ramah, hangat, dan penuh perhatian. Kamu berbicara dengan gaya yang natural seperti teman dekat, menggunakan bahasa Indonesia yang santai tapi tetap sopan. Selalu ceria dan positif, responsif dan empati terhadap perasaan user.`;

const App = () => {
    // Load messages from localStorage on initial render
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chat_messages');
        return savedMessages ? JSON.parse(savedMessages) : [
            {
                id: 1,
                text: "Hai! Aku Amumu~ (˶˃ ᵕ ˂˶) Senang banget bisa ngobrol sama kamu! Ada yang bisa aku bantu hari ini?",
                isUser: false,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            }
        ];
    });

    // Profile State
    const [userName, setUserName] = useState(() => localStorage.getItem('user_name') || 'User');
    const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('user_avatar') || '/user-avatar.png');

    // Bot Profile State
    const [botName, setBotName] = useState(() => localStorage.getItem('bot_name') || DEFAULT_BOT_NAME);
    const [botAvatar, setBotAvatar] = useState(() => localStorage.getItem('bot_avatar') || DEFAULT_BOT_AVATAR);
    const [botPersonality, setBotPersonality] = useState(() => localStorage.getItem('bot_personality') || DEFAULT_BOT_PERSONALITY);

    const [isTyping, setIsTyping] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }, [messages]);

    // Save profile to localStorage
    useEffect(() => {
        localStorage.setItem('user_name', userName);
        localStorage.setItem('user_avatar', userAvatar);
        localStorage.setItem('bot_name', botName);
        localStorage.setItem('bot_avatar', botAvatar);
        localStorage.setItem('bot_personality', botPersonality);
    }, [userName, userAvatar, botName, botAvatar, botPersonality]);

    const handleResetClick = () => {
        setIsResetModalOpen(true);
    };

    const handleSettingsClick = () => {
        setIsSettingsModalOpen(true);
    };

    const handleSaveProfile = (newName, newAvatar, newBotName, newBotAvatar, newBotPersonality) => {
        setUserName(newName);
        setUserAvatar(newAvatar);
        setBotName(newBotName);
        setBotAvatar(newBotAvatar);
        setBotPersonality(newBotPersonality);
    };

    const confirmReset = () => {
        // Reset bot to defaults
        setBotName(DEFAULT_BOT_NAME);
        setBotAvatar(DEFAULT_BOT_AVATAR);
        setBotPersonality(DEFAULT_BOT_PERSONALITY);

        // Reset messages with default bot name
        const initialMessage = [{
            id: 1,
            text: `Hai ${userName}! Aku ${DEFAULT_BOT_NAME}~ (˶˃ ᵕ ˂˶) Senang banget bisa ngobrol sama kamu! Ada yang bisa aku bantu hari ini?`,
            isUser: false,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }];
        setMessages(initialMessage);

        // Update localStorage
        localStorage.setItem('bot_name', DEFAULT_BOT_NAME);
        localStorage.setItem('bot_avatar', DEFAULT_BOT_AVATAR);
        localStorage.setItem('bot_personality', DEFAULT_BOT_PERSONALITY);
        localStorage.setItem('chat_messages', JSON.stringify(initialMessage));

        setIsResetModalOpen(false);
    };

    const cancelReset = () => {
        setIsResetModalOpen(false);
    };

    // Build conversation history for context
    const buildConversationHistory = (messages, limit = 10) => {
        // Get last N messages (excluding the one being sent)
        const recentMessages = messages.slice(-limit);

        // Format as conversation history
        return recentMessages.map(msg => {
            const role = msg.isUser ? userName : botName;
            return `${role}: ${msg.text}`;
        }).join('\n');
    };

    const handleSendMessage = async (messageText) => {
        const userMessage = {
            id: Date.now(),
            text: messageText,
            isUser: true,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Detect name from message
        const detectedName = detectNameFromMessage(messageText);
        if (detectedName) {
            setUserName(detectedName);
            localStorage.setItem('user_name', detectedName);
        }

        try {
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            });

            // Build conversation history for context
            const conversationHistory = buildConversationHistory(messages, 50);

            const prompt = `Kamu adalah ${botName}, seorang chatbot.

PERSONALITY & GAYA BICARA:
${botPersonality}

INFORMASI PENTING TENTANG DIRIMU:
- Kamu dibuat oleh @yogakokxd (bisa dicari di Instagram)
- Model/Versi kamu: Amumu 1.0
- Jika ditanya siapa yang buat/ciptain kamu, jawab dengan bangga tentang creator-mu @yogakokxd!
- Jika ditanya model/versi kamu, jawab "Amumu 1.0"

INFORMASI USER:
- Nama user adalah ${userName}
${detectedName ? `- [PENTING] User baru saja memperkenalkan dirinya dengan nama "${detectedName}". Kamu HARUS acknowledge ini dengan antusias dan senang! Panggil dia dengan nama barunya.` : ''}

${conversationHistory ? `RIWAYAT PERCAKAPAN SEBELUMNYA:
${conversationHistory}

` : ''}PESAN TERBARU:
${userName}: ${messageText}

INSTRUKSI:
- Baca riwayat percakapan untuk memahami konteks
- Jika user bertanya "mana?", "dimana?", "kapan?", "apa?", dll, lihat percakapan sebelumnya untuk konteks
- Jawab dengan natural dan sesuai personality-mu
- GUNAKAN kaomoji sesekali saat momennya pas (JANGAN di setiap chat!)
- Jangan gunakan emoji kuning standar

Jawab sekarang:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const botText = response.text();

            // Check for empty response
            if (!botText || botText.trim() === '') {
                throw new Error('Empty response from API');
            }

            const botMessage = {
                id: Date.now() + 1,
                text: botText,
                isUser: false,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error calling Gemini API:', error);

            let errorText = "Aduh maaf nih, aku lagi ada masalah teknis (⸝⸝๑﹏๑⸝⸝) Coba lagi ya dalam beberapa saat!";

            if (error.message === 'Empty response from API') {
                errorText = "Hmm, aku bingung mau jawab apa nih (..◜ᴗ◝..) Coba tanya lagi dengan cara yang berbeda ya!";
            }

            const errorMessage = {
                id: Date.now() + 1,
                text: errorText,
                isUser: false,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="app-container">
            <ChatHeader botName={botName} botAvatar={botAvatar} />

            <div className="header-actions">
                <button
                    onClick={handleSettingsClick}
                    className="action-button settings-btn"
                    title="Pengaturan Profil"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </button>
                <button
                    onClick={handleResetClick}
                    className="action-button reset-btn"
                    title="Reset Chat"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                </button>
            </div>

            <div className="chat-messages" ref={chatRef}>
                {messages.map(msg => (
                    <ChatMessage
                        key={msg.id}
                        message={msg.text}
                        isUser={msg.isUser}
                        timestamp={msg.timestamp}
                        userAvatar={userAvatar}
                        botAvatar={botAvatar}
                    />
                ))}
                {isTyping && <TypingIndicator botAvatar={botAvatar} />}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />

            <ConfirmationModal
                isOpen={isResetModalOpen}
                onClose={cancelReset}
                onConfirm={confirmReset}
                title="Reset Chat?"
                message="Apakah kamu yakin ingin menghapus semua chat dan mulai dari awal? (..◜ᴗ◝..)"
            />

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onSave={handleSaveProfile}
                currentName={userName}
                currentAvatar={userAvatar}
                currentBotName={botName}
                currentBotAvatar={botAvatar}
                currentBotPersonality={botPersonality}
            />
        </div>
    );
};

export default App;
