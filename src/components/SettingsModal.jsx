import React, { useState, useRef } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, onSave, currentName, currentAvatar, currentBotName, currentBotAvatar, currentBotPersonality }) => {
    const [activeTab, setActiveTab] = useState('user'); // 'user' or 'bot'

    // User State
    const [name, setName] = useState(currentName);
    const [avatar, setAvatar] = useState(currentAvatar);

    // Bot State
    const [botName, setBotName] = useState(currentBotName);
    const [botAvatar, setBotAvatar] = useState(currentBotAvatar);
    const [botPersonality, setBotPersonality] = useState(currentBotPersonality);

    const fileInputRef = useRef(null);
    const botFileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e, isBot = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isBot) {
                    setBotAvatar(reader.result);
                } else {
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(name, avatar, botName, botAvatar, botPersonality);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="settings-modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Pengaturan</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="settings-tabs">
                    <button
                        className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
                        onClick={() => setActiveTab('user')}
                    >
                        Profil Kamu
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'bot' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bot')}
                    >
                        Profil Bot
                    </button>
                </div>

                <div className="settings-body">
                    {activeTab === 'user' ? (
                        <>
                            <div className="avatar-section">
                                <div className="avatar-preview">
                                    <img src={avatar} alt="User Preview" />
                                </div>
                                <button
                                    className="upload-button"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Ubah Foto
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => handleFileChange(e, false)}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className="input-group">
                                <label>Nama Kamu</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Masukkan namamu..."
                                    className="settings-input"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="avatar-section">
                                <div className="avatar-preview">
                                    <img src={botAvatar} alt="Bot Preview" />
                                </div>
                                <button
                                    className="upload-button"
                                    onClick={() => botFileInputRef.current.click()}
                                >
                                    Ubah Foto Bot
                                </button>
                                <input
                                    type="file"
                                    ref={botFileInputRef}
                                    onChange={(e) => handleFileChange(e, true)}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className="input-group">
                                <label>Nama Bot</label>
                                <input
                                    type="text"
                                    value={botName}
                                    onChange={(e) => setBotName(e.target.value)}
                                    placeholder="Beri nama bot..."
                                    className="settings-input"
                                />
                            </div>

                            <div className="input-group">
                                <label>Gaya Bicara / Personality</label>
                                <textarea
                                    value={botPersonality}
                                    onChange={(e) => setBotPersonality(e.target.value)}
                                    placeholder="Contoh: Bicara seperti anak muda yang energik, suka pake bahasa gaul, selalu ceria..."
                                    className="settings-textarea"
                                    rows="4"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-actions">
                    <button className="modal-button cancel" onClick={onClose}>
                        Batal
                    </button>
                    <button className="modal-button save" onClick={handleSave}>
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
