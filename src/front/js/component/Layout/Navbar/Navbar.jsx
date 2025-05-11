import React from "react"
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faLanguage, faXmark } from '@fortawesome/free-solid-svg-icons';
import dataclothLogo from './../../../../img/datacloth_logo.png';

function Navbar() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' },
    { id: 'fr', name: 'Français' },
    { id: 'de', name: 'Deutsch' },
    { id: 'it', name: 'Italiano' },
  ];

  const handleLanguageSelect = (langId) => {
    setSelectedLang(langId);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar bg-white flex justify-between items-center fixed top-0 z-50 w-full py-5 px-8 text-sm font-light border-b shadow">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={dataclothLogo} style={{ height: '50px' }} alt="Logo" />
      </div>

      {/* Botón Hamburguesa (para vista Mobile) */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
      </button>

      {/* Menú completo */}
      <ul className={`flex-col md:flex-row md:flex items-center gap-4 absolute md:static top-20 left-0 w-full md:w-auto bg-white md:bg-transparent px-8 py-4 md:py-0 transition-all duration-300 ease-in-out ${menuOpen ? 'flex' : 'hidden'}`}>
        <li className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="font-semibold text-lg flex items-center gap-2 px-2 py-1 border rounded text-gray-700 hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faLanguage} size="2xl" style={{ color: "#74C0FC" }} />
            <span className="capitalize">{selectedLang}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageSelect(lang.id)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </li>
        <li>
          <div className="flex items-center">
            <img
              className="rounded-full"
              style={{ width: '40px', height: '40px' }}
              src="https://avatar.iran.liara.run/public/boy"
              alt="avatar"
            />
            <div className="ml-3">
              <p className="font-semibold">Jose Gonzales</p>
              <span>Administrator</span>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
