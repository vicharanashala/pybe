import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SurvivalMode from './components/SurvivalMode';
import CreativeSandbox from './components/CreativeSandbox';
import './MinecraftList.css'; // The scoped CSS module

export default function MinecraftList() {
  const [activeTab, setActiveTab] = useState('welcome');

  return (
    <div className="minecraft-app">
      <div className="app">
        <header className="top">
          <div className="brand">
            <div className="brand-mark">🟩</div>
            <div>
              <h1>Steve's Inventory</h1>
              <p>Learn Python Lists the Minecraft way!</p>
            </div>
          </div>
          <nav className="tabs">
            <button 
              className={activeTab === 'welcome' ? 'active' : ''} 
              onClick={() => setActiveTab('welcome')}
            >
              Main Menu
            </button>
            <button 
              className={activeTab === 'story' ? 'active' : ''} 
              onClick={() => setActiveTab('story')}
            >
              Survival Mode
            </button>
            <button 
              className={activeTab === 'sandbox' ? 'active' : ''} 
              onClick={() => setActiveTab('sandbox')}
            >
              Creative Sandbox
            </button>
            {/* Provide a way to get back to the main PyBe dashboard */}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#2b2b2b', color: '#fff', marginLeft: '10px' }}>
                Exit Game (Dashboard)
              </button>
            </Link>
          </nav>
        </header>

        {/* ============ WELCOME VIEW ============ */}
        {activeTab === 'welcome' && (
          <div className="view active">
            <div className="hero-section">
              <div className="hero-text">
                <h2 className="display">Ready to Survive?</h2>
                <p>Join Steve and use his Inventory to learn all about <strong>Python Lists</strong>.</p>
                <p>A list in Python is exactly like a Minecraft hotbar: you can add items, move them around, take them out, and craft with them!</p>
                <button 
                  className="primary-btn huge-btn accent" 
                  onClick={() => setActiveTab('story')}
                >
                  Start Survival Mode
                </button>
              </div>
              <div className="hero-image" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ fontSize: '150px', filter: 'drop-shadow(10px 10px 0px rgba(0,0,0,0.5))' }}>⛏️</div>
              </div>
            </div>
          </div>
        )}

        {/* ============ STORY VIEW ============ */}
        {activeTab === 'story' && (
          <div className="view active">
            <SurvivalMode onSandboxSwitch={() => setActiveTab('sandbox')} />
          </div>
        )}

        {/* ============ SANDBOX VIEW ============ */}
        {activeTab === 'sandbox' && (
          <div className="view active">
            <CreativeSandbox />
          </div>
        )}

      </div>
    </div>
  );
}
