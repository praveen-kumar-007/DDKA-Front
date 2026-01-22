
import React from 'react';
import type { IDCardData } from '../types';

interface Props {
  data: IDCardData;
}

export const IDCardFront: React.FC<Props> = ({ data }) => {
  const formatDOB = (dobString: string) => {
    try {
      const date = new Date(dobString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dobString;
    }
  };

  return (
    <div
      style={{
        width: '210px',
        height: '330px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(0, 20, 40, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        position: 'relative',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Watermark (larger, still subtle) */}
      <img
        src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png"
        alt="DDKA Watermark"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, 10%)', // slightly lower
          width: '140px',                 // larger footprint
          height: 'auto',
          opacity: 0.07,                  // subtle but noticeable
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Top Header - Deep Blue with DDKA Logo */}
      <div
        style={{
          background: 'linear-gradient(135deg, #00579B, #003366)',
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png"
          alt="DDKA Logo"
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            objectFit: 'contain',
            backgroundColor: 'white',
            padding: '2px',
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#FFFFFF',
              lineHeight: 1.1,
              textAlign: 'left',
            }}
          >
            Dhanbad District Kabaddi
          </div>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 600,
              color: '#FFFFFF',
              lineHeight: 1.1,
              textAlign: 'left',
            }}
          >
            Association
          </div>
        </div>
      </div>

      {/* Photo - Centered Circular Image with decorative circle behind */}
      <div
        style={{
          marginTop: '0px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
  
        <img
          src={data.photoUrl}
          alt={data.name}
          style={{
            width: '86px',
            height: '98px',
            objectFit: 'cover',
            border: '3px solid #ffffff',
            borderRadius: '50%',
            boxShadow: '0 3px 9px rgba(0, 0, 0, 0.12)',
            backgroundColor: '#e0e0e0',
            position: 'relative',
            zIndex: 2,
          }}
        />
      </div>

      {/* Details Section */}
      <div
        style={{
          padding: '6px 11px 80px 11px', // extra bottom padding so bottom bar is visible and content is nudged up
          boxSizing: 'border-box',
          textAlign: 'center',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#003366',
            marginBottom: '1px',
            marginTop: '0px',
          }}
        >
          {data.name}
        </h2>
        <p
          style={{
            fontSize: '8.5px',
            fontWeight: 600,
            color: '#FF6F00',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.35px',
          }}
        >
          {data.memberRole ? data.memberRole : 'DDKA MEMBER'}
        </p>

        {/* ID - emphasized and doubled size */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px', marginBottom: '2px' }}>
          <div style={{ color: '#003366', fontWeight: 600, fontSize: '10px', letterSpacing: '0.6px' }}>{data.idNo}</div>
        </div>

        {/* Detail Grid - aligned labels and values */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '58px 1fr',
            gap: '4px 6px',
            textAlign: 'left',
            fontSize: '8.5px',
            marginTop: '2px',
            lineHeight: 1.25,
          }}
        >

          <span style={{ fontWeight: 600, color: '#333', fontSize: '8px' }}>DOB:</span>
          <span style={{ fontWeight: 500, color: '#111', fontSize: '8.5px' }}>{formatDOB(data.dob)}</span>

          <span style={{ fontWeight: 600, color: '#333', fontSize: '8px' }}>Role:</span>
          <span style={{ fontWeight: 500, color: '#111', fontSize: '8.5px' }}>{data.memberRole || 'Player'}</span>

          <span style={{ fontWeight: 600, color: '#333', fontSize: '8px' }}>Blood:</span>
          <span style={{ fontWeight: 700, color: '#C62828', fontSize: '8.5px' }}>{data.bloodGroup}</span>

          <span style={{ fontWeight: 600, color: '#333', fontSize: '8px' }}>Phone:</span>
          <span style={{ fontWeight: 500, color: '#111', fontSize: '8.5px' }}>{data.phone}</span>

          <span style={{ fontWeight: 600, color: '#333', fontSize: '8px', marginTop: '2.5px' }}>Address:</span>
          <span style={{ fontWeight: 500, color: '#111', fontSize: '8px', lineHeight: 1.2 }}>{data.address}</span>

          <span style={{ fontWeight: 600, color: '#333', fontSize: '8px', marginTop: '2.5px' }}>Father:</span>
          <span style={{ fontWeight: 500, color: '#111', fontSize: '8px' }}>{data.fathersName}</span>
        </div>
      </div>

      {/* Bottom Bar - Blue Accent with centered slogan */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '22px',
          background: 'linear-gradient(135deg, #003366, #00579B)',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          zIndex: 20,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ color: '#ffffff', fontSize: '10px', fontWeight: 600, pointerEvents: 'none' }}>मिट्टी का खेल, देश का खेल, कबड्डी अपना खेल</div>
      </div>
    </div>
  );
};
