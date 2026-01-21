
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

      {/* Photo - Centered Circular Image */}
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
          }}
        />
      </div>

      {/* Details Section */}
      <div
        style={{
          padding: '7px 11px 9px 11px',
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
            marginTop: '2px',
          }}
        >
          {data.name}
        </h2>
        <p
          style={{
            fontSize: '8.5px',
            fontWeight: 600,
            color: '#FF6F00',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.35px',
          }}
        >
          {data.memberRole ? data.memberRole : 'DDKA MEMBER'}
        </p>

        {/* Detail Grid - aligned labels and values */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '58px 1fr',
            gap: '3.5px 5px',
            textAlign: 'left',
            fontSize: '8.5px',
            marginTop: 'auto',
            lineHeight: 1.25,
          }}
        >
          <span style={{ fontWeight: 600, color: '#333', fontSize: '8px' }}>ID:</span>
          <span style={{ fontWeight: 600, color: '#003366', fontSize: '8.5px' }}>{data.idNo}</span>

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

      {/* Bottom Bar - Orange Accent */}
      <div
        style={{
          height: '5px',
          background: 'linear-gradient(135deg, #FF8F00, #FF6F00)',
          marginTop: 'auto',
        }}
      />
    </div>
  );
};
