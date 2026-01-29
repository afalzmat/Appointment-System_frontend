import React, { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Phone, Clock, Users, User,
  Search, X, AlertCircle
} from 'lucide-react'; 

/* =========================
   CONFIG
========================= */
const API_URL = import.meta.env.VITE_API_URL; // definido en Vercel

/* =========================
   COMPONENT
========================= */
export default function AppointmentSystem() {
  const [step, setStep] = useState('initial');
  const [appointmentType, setAppointmentType] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifyQR, setVerifyQR] = useState('');

  /* =========================
     DEBUG
  ========================= */
  useEffect(() => {
    console.log('STEP →', step);
    console.log('API_URL →', API_URL);
  }, [step]);

  /* =========================
     MOCK DATA
  ========================= */
  useEffect(() => {
    setCenters([
      {
        id: '1',
        nombre: 'Centro Santo Domingo',
        direccion: 'Av. Winston Churchill, Santo Domingo, RD',
        telefono: '+1 809 555 1234',
        latitud: 18.4861,
        longitud: -69.9312,
        country_name: 'República Dominicana'
      }
    ]);
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const resetFlow = () => {
    setStep('initial');
    setAppointmentType(null);
    setCurrentUser(null);
    setIdentifier('');
    setSelectedCenter(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setError(null);
  };

  const handleIdentifierSubmit = () => {
    if (!identifier.trim()) {
      setError('Ingrese una identificación válida');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setCurrentUser({
        id: '1',
        cedula: identifier,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@email.com',
        telefono: '8090000000'
      });
      setLoading(false);
      setStep('confirm-user');
    }, 800);
  };

  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    setAvailableDates(dates);
    setStep('select-date');
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setAvailableTimes(['09:00', '10:00', '11:00', '14:00', '15:00']);
    setStep('select-time');
  };

  /* =========================
     RENDERS POR PASO
  ========================= */
  const ScreenWrapper = ({ children }) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );

  const renderInitial = () => (
    <ScreenWrapper>
      <div className="bg-white rounded-lg shadow-xl p-8 mt-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          Sistema de Citas Online
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setStep('verify')}
            className="bg-green-500 text-white p-8 rounded-lg"
          >
            <Search size={40} />
            Verificar Cita
          </button>
          <button
            onClick={() => setStep('type')}
            className="bg-indigo-600 text-white p-8 rounded-lg"
          >
            <Calendar size={40} />
            Nueva Cita
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );

  const renderType = () => (
    <ScreenWrapper>
      <button onClick={resetFlow} className="mb-4 flex gap-2">
        <X /> Volver
      </button>
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => {
              setAppointmentType('individual');
              setStep('identifier');
            }}
            className="bg-blue-500 text-white p-8 rounded-lg"
          >
            <User size={40} /> Individual
          </button>
          <button
            onClick={() => {
              setAppointmentType('group');
              setStep('identifier');
            }}
            className="bg-purple-500 text-white p-8 rounded-lg"
          >
            <Users size={40} /> Grupal
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );

  const renderIdentifier = () => (
    <ScreenWrapper>
      <button onClick={() => setStep('type')} className="mb-4 flex gap-2">
        <X /> Volver
      </button>
      <div className="bg-white p-8 rounded-lg shadow">
        <input
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Cédula o evento"
          className="w-full border p-3 rounded"
        />
        {error && (
          <div className="text-red-600 mt-2 flex gap-2">
            <AlertCircle /> {error}
          </div>
        )}
        <button
          onClick={handleIdentifierSubmit}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Buscando...' : 'Continuar'}
        </button>
      </div>
    </ScreenWrapper>
  );

  const renderConfirmUser = () => (
    <ScreenWrapper>
      <button onClick={() => setStep('identifier')} className="mb-4 flex gap-2">
        <X /> Volver
      </button>
      <div className="bg-white p-8 rounded-lg shadow">
        <p><b>{currentUser.nombre} {currentUser.apellido}</b></p>
        <p>{currentUser.cedula}</p>
        <button
          onClick={() => setStep('select-center')}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Confirmar
        </button>
      </div>
    </ScreenWrapper>
  );

  const renderSelectCenter = () => (
    <ScreenWrapper>
      {centers.map(c => (
        <div
          key={c.id}
          onClick={() => handleSelectCenter(c)}
          className="bg-white p-6 rounded shadow mb-4 cursor-pointer"
        >
          <h3 className="font-bold">{c.nombre}</h3>
          <p>{c.direccion}</p>
          <p><Phone size={14} /> {c.telefono}</p>
        </div>
      ))}
    </ScreenWrapper>
  );

  const renderSelectDate = () => (
    <ScreenWrapper>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availableDates.map(d => (
          <button
            key={d}
            onClick={() => handleSelectDate(d)}
            className="bg-white p-4 rounded shadow"
          >
            {d}
          </button>
        ))}
      </div>
    </ScreenWrapper>
  );

  const renderSelectTime = () => (
    <ScreenWrapper>
      <div className="grid grid-cols-3 gap-3">
        {availableTimes.map(t => (
          <button
            key={t}
            onClick={() => {
              setSelectedTime(t);
              setStep('summary');
            }}
            className="bg-white p-4 rounded shadow"
          >
            <Clock size={14} /> {t}
          </button>
        ))}
      </div>
    </ScreenWrapper>
  );

  const renderSummary = () => (
    <ScreenWrapper>
      <div className="bg-white p-8 rounded shadow">
        <p><b>{currentUser.nombre}</b></p>
        <p>{selectedDate} — {selectedTime}</p>
        <button
          onClick={() => setStep('complete')}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Confirmar Cita
        </button>
      </div>
    </ScreenWrapper>
  );

  const renderComplete = () => (
    <ScreenWrapper>
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold">¡Cita Confirmada!</h2>
        <button
          onClick={resetFlow}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Nueva Cita
        </button>
      </div>
    </ScreenWrapper>
  );

  const renderInvalid = () => (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
      <h2>Estado inválido</h2>
      <p>step = {String(step)}</p>
      <button onClick={resetFlow} className="mt-4 underline">
        Reiniciar
      </button>
    </div>
  );

  /* =========================
     SWITCH CENTRAL
  ========================= */
  switch (step) {
    case 'initial': return renderInitial();
    case 'verify': return renderInitial(); // placeholder
    case 'type': return renderType();
    case 'identifier': return renderIdentifier();
    case 'confirm-user': return currentUser ? renderConfirmUser() : renderInvalid();
    case 'select-center': return renderSelectCenter();
    case 'select-date': return renderSelectDate();
    case 'select-time': return renderSelectTime();
    case 'summary': return renderSummary();
    case 'complete': return renderComplete();
    default: return renderInvalid();
  }
}
/*import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, Mail, Clock, Users, User, Search, X, Check, AlertCircle } from 'lucide-react';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL;

const AppointmentSystem = () => {
  const [step, setStep] = useState('initial'); // initial, verify, type, identifier, confirm-user, select-center, select-date, select-time, summary, complete
  const [appointmentType, setAppointmentType] = useState(null); // individual, group
  const [groupData, setGroupData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifyQR, setVerifyQR] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    setCenters([
      {
        id: '1',
        nombre: 'Centro Madrid',
        direccion: 'Calle Gran Vía 28, Madrid, España',
        telefono: '+34 91 123 4567',
        latitud: 40.4168,
        longitud: -3.7038,
        country_name: 'España'
      },
      {
        id: '2',
        nombre: 'Centro Santo Domingo',
        direccion: 'Av. Winston Churchill, Santo Domingo, RD',
        telefono: '+1 809 555 1234',
        latitud: 18.4861,
        longitud: -69.9312,
        country_name: 'República Dominicana'
      },
      {
        id: '3',
        nombre: 'Centro Nueva York',
        direccion: '123 Broadway, New York, NY',
        telefono: '+1 212 555 7890',
        latitud: 40.7128,
        longitud: -74.0060,
        country_name: 'Estados Unidos'
      }
    ]);
  }, []);

  const handleVerifyAppointment = async () => {
    setLoading(true);
    setError(null);
    
    // Simulated verification
    setTimeout(() => {
      setLoading(false);
      alert('Funcionalidad de verificación - conectar con API');
    }, 1000);
  };

  const handleIdentifierSubmit = async () => {
    if (!identifier.trim()) {
      setError('Por favor ingrese un número de cédula o evento');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulated API call
    setTimeout(() => {
      // Mock user data
      setCurrentUser({
        id: '1',
        cedula: identifier,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@email.com',
        telefono: '+1 809 555 0000'
      });
      setLoading(false);
      setStep('confirm-user');
    }, 1000);
  };

  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
    // Mock available dates
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    setAvailableDates(dates);
    setStep('select-date');
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    // Mock available times
    setAvailableTimes([
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ]);
    setStep('select-time');
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    setStep('summary');
  };

  const handleConfirmAppointment = async () => {
    setLoading(true);
    
    // Simulated API call
    setTimeout(() => {
      setLoading(false);
      setStep('complete');
    }, 1500);
  };

  const resetFlow = () => {
    setStep('initial');
    setAppointmentType(null);
    setGroupData(null);
    setCurrentUser(null);
    setIdentifier('');
    setSelectedCenter(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setError(null);
  };

  const openInMaps = (lat, lng, address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  // Initial Screen
  if (step === 'initial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
            <h1 className="text-3xl font-bold text-center text-indigo-900 mb-8">
              Sistema de Citas Online
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setStep('verify')}
                className="bg-green-500 hover:bg-green-600 text-white p-8 rounded-lg transition flex flex-col items-center gap-4"
              >
                <Search size={48} />
                <span className="text-xl font-semibold">Verificar Cita</span>
                <span className="text-sm">Consulta el estado de tu cita</span>
              </button>

              <button
                onClick={() => setStep('type')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-8 rounded-lg transition flex flex-col items-center gap-4"
              >
                <Calendar size={48} />
                <span className="text-xl font-semibold">Nueva Cita</span>
                <span className="text-sm">Agenda una nueva cita</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verify Screen
  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={resetFlow}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            <X size={20} /> Volver
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">
              Verificar Cita
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código QR o Número de Cita
                </label>
                <input
                  type="text"
                  value={verifyQR}
                  onChange={(e) => setVerifyQR(e.target.value)}
                  placeholder="Ingrese el código"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleVerifyAppointment}
                disabled={loading || !verifyQR.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition font-semibold"
              >
                {loading ? 'Verificando...' : 'Verificar Cita'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Type Selection
  if (step === 'type') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={resetFlow}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            <X size={20} /> Volver
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">
              Tipo de Cita
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setAppointmentType('individual');
                  setStep('identifier');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-lg transition flex flex-col items-center gap-4"
              >
                <User size={48} />
                <span className="text-xl font-semibold">Individual</span>
                <span className="text-sm">Agendar para una persona</span>
              </button>

              <button
                onClick={() => {
                  setAppointmentType('group');
                  setStep('identifier');
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white p-8 rounded-lg transition flex flex-col items-center gap-4"
              >
                <Users size={48} />
                <span className="text-xl font-semibold">Grupal</span>
                <span className="text-sm">Agendar para varias personas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Identifier Input
  if (step === 'identifier') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setStep('type')}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            <X size={20} /> Volver
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">
              Identificación
            </h2>
            <p className="text-gray-600 mb-6">
              {appointmentType === 'group' ? 'Primera persona del grupo' : 'Ingrese su identificación'}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Cédula o Evento
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Ej: 001-1234567-8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                onClick={handleIdentifierSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition font-semibold"
              >
                {loading ? 'Buscando...' : 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirm User
  if (step === 'confirm-user' && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setStep('identifier')}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            <X size={20} /> Volver
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">
              Confirmar Información
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Nombre Completo</p>
                <p className="font-semibold text-gray-900">{currentUser.nombre} {currentUser.apellido}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Cédula</p>
                <p className="font-semibold text-gray-900">{currentUser.cedula}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{currentUser.email}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-semibold text-gray-900">{currentUser.telefono}</p>
              </div>
            </div>

            <button
              onClick={() => setStep('select-center')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition font-semibold"
            >
              Confirmar y Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Select Center
  if (step === 'select-center') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep('confirm-user')}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            <X size={20} /> Volver
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">
              Seleccionar Centro
            </h2>
            
            <div className="space-y-4">
              {centers.map((center) => (
                <div
                  key={center.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-indigo-500 hover:shadow-md transition cursor-pointer"
                  onClick={() => handleSelectCenter(center)}
                >
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{center.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-3">{center.country_name}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin size={16} className="mt-1 flex-shrink-0" />
                      <span>{center.direccion}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone size={16} />
                      <span>{center.telefono}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInMaps(center.latitud, center.longitud, center.direccion);
                    }}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                  >
                    <MapPin size={16} />
                    Ver en mapa / Cómo llegar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Select Date
  if (step === 'select-date') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep('select-center')}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            <X size={20} /> Volver
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">
              Seleccionar Fecha
            </h2>
            <p className="text-gray-600 mb-6">{selectedCenter?.nombre}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableDates.map((date) => {
                const dateObj = new Date(date + 'T00:00:00');
                const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString('es-ES', { month: 'short' });
                
                return (
                  <button
                    key={date}
                    onClick={() => handleSelectDate(date)}
                    className="bg-gray-50 hover:bg-indigo-100 border-2 border-gray-200 hover:border-indigo-500 p-4 rounded-lg transition text-center"
                  >
                    <div className="text-sm text-gray-600 capitalize">{dayName}</div>
                    <div className="text-2xl font-bold text-gray-900">{dayNum}</div>
                    <div className="text-sm text-gray-600 capitalize">{monthName}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Select Time
  if (step === 'select-time') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep('select-date')}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            <X size={20} /> Volver
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">
              Seleccionar Hora
            </h2>
            <p className="text-gray-600 mb-6">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleSelectTime(time)}
                  className="bg-gray-50 hover:bg-indigo-100 border-2 border-gray-200 hover:border-indigo-500 p-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Clock size={16} />
                  <span className="font-semibold">{time}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Summary
  if (step === 'summary') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep('select-time')}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            <X size={20} /> Volver
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">
              Resumen de la Cita
            </h2>
            
            <div className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-bold text-indigo-900 mb-4">Datos Personales</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Nombre</p>
                    <p className="font-semibold">{currentUser.nombre} {currentUser.apellido}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cédula</p>
                    <p className="font-semibold">{currentUser.cedula}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Teléfono</p>
                    <p className="font-semibold">{currentUser.telefono}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-green-900 mb-4">Detalles de la Cita</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Centro</p>
                    <p className="font-semibold">{selectedCenter.nombre}</p>
                    <p className="text-gray-600 text-xs mt-1">{selectedCenter.direccion}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Fecha</p>
                      <p className="font-semibold">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hora</p>
                      <p className="font-semibold">{selectedTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmAppointment}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-lg transition font-semibold text-lg flex items-center justify-center gap-2"
              >
                {loading ? 'Procesando...' : (
                  <>
                    <Check size={24} />
                    Confirmar Cita
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete
  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Cita Confirmada!
            </h2>
            
            <p className="text-gray-600 mb-8">
              Tu cita ha sido agendada exitosamente. Recibirás un correo electrónico y SMS con los detalles y un código QR para verificar tu cita.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
              <p className="text-sm text-gray-600">
                Guarda este código QR para verificar tu cita
              </p>
            </div>

            <button
              onClick={resetFlow}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition font-semibold"
            >
              Agendar Otra Cita
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export default AppointmentSystem;*/

