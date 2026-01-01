import React from 'react';
import type { IDCardData } from '../types';

interface Props {
  data: IDCardData;
}

export const IDCardBack: React.FC<Props> = ({ data }) => {
  const qrData = `DDKA:${data.idNo}:${data.name}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=65x65&data=${encodeURIComponent(
    qrData,
  )}`;

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
      {/* Top Header - Deep Blue */}
      <div
        style={{
          background: 'linear-gradient(135deg, #00579B, #003366)',
          color: '#ffffff',
          textAlign: 'center',
          padding: '7px 9px',
        }}
      >
        <h3
          style={{
            fontSize: '11.5px',
            fontWeight: 600,
            marginBottom: '1px',
            marginTop: 0,
          }}
        >
          Dhanbad District Kabaddi
        </h3>
        <p
          style={{
            fontSize: '8px',
            fontWeight: 400,
            opacity: 0.9,
            margin: 0,
          }}
        >
          Member ID Card
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: '9px 11px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          fontSize: '8.5px',
          color: '#333',
          lineHeight: 1.25,
        }}
      >
        <h4
          style={{
            fontSize: '9.5px',
            fontWeight: 600,
            color: '#003366',
            marginBottom: '3.5px',
            textAlign: 'center',
          }}
        >
          About DDKA
        </h4>
        <p
          style={{
            textAlign: 'center',
            marginBottom: '7px',
            fontSize: '8px',
            lineHeight: 1.2,
            color: '#444',
          }}
        >
          Promoting excellence in Kabaddi. Dedicated to developing talent, fitness, and sportsmanship.
        </p>

        {/* QR Section */}
        <div
          style={{
            textAlign: 'center',
            margin: '5px 0',
          }}
        >
          <img
            src={qrUrl}
            alt="QR Code"
            style={{
              width: '65px',
              height: '65px',
              border: '1.5px solid #004A99',
              borderRadius: '2.5px',
              margin: '0 auto 3.5px auto',
              display: 'block',
              backgroundColor: '#fff',
            }}
          />
          <p
            style={{
              fontSize: '8px',
              fontWeight: 500,
              color: '#003366',
              margin: 0,
            }}
          >
            Scan for Details
          </p>
        </div>

        {/* Issuing Info */}
        <div
          style={{
            fontSize: '8px',
            textAlign: 'center',
            margin: '5px 0 2.5px 0',
            paddingTop: '5px',
            borderTop: '1px dashed #004A99',
            color: '#444',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#003366' }}>Phone:</strong> +91-6542-8765-43
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#003366' }}>Email:</strong> ddka@kabaddi.in
          </p>
        </div>

        <div
          style={{
            fontSize: '8px',
            textAlign: 'center',
            margin: '2.5px 0 5px 0',
            color: '#444',
            wordWrap: 'break-word',
            lineHeight: 1.2,
          }}
        >
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#003366' }}>Address:</strong> Dhanbad, Jharkhand, India
          </p>
        </div>

        {/* Contact Info */}
        <div
          style={{
            fontSize: '7.5px',
            textAlign: 'center',
            color: '#555',
            marginTop: 'auto',
            paddingTop: '5px',
            borderTop: '1px solid #FF8F00',
            lineHeight: 1.2,
            wordWrap: 'break-word',
          }}
        >
          <p style={{ margin: 0 }}>If found, please return to DDKA office.</p>
        </div>
      </div>

      {/* Bottom Bar - Orange Accent */}
      <div
        style={{
          height: '4.5px',
          background: 'linear-gradient(135deg, #FF8F00, #FF6F00)',
        }}
      />
    </div>
  );
};
