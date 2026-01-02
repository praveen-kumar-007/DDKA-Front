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
      {/* Top Header - Deep Blue with AKFI Logo */}
      <div
        style={{
          background: 'linear-gradient(135deg, #00579B, #003366)',
          color: '#ffffff',
          padding: '7px 9px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <img
          src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/akfi-logo_sydpx7.png"
          alt="AKFI Logo"
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            objectFit: 'contain',
            backgroundColor: 'white',
            padding: '2px',
          }}
        />
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            Dhanbad District Kabaddi
          </div>
          <div
            style={{
              fontSize: '8px',
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            Member ID Card
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: '8px 10px',
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
            marginBottom: '5px',
            fontSize: '8px',
            lineHeight: 1.2,
            color: '#444',
          }}
        >
          Promoting excellence in Kabaddi. Dedicated to developing talent, fitness, and sportsmanship.
        </p>

        <p
          style={{
            textAlign: 'center',
            marginBottom: '4px',
            fontSize: '7.5px',
            lineHeight: 1.2,
            color: '#444',
          }}
        >
          Affiliated to Jharkhand State Kabaddi Association and recognised by AKFI.
        </p>

        {/* QR Section */}
        <div
          style={{
            textAlign: 'center',
            margin: '4px 0',
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
            margin: '4px 0 2px 0',
            paddingTop: '5px',
            borderTop: '1px dashed #004A99',
            color: '#444',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#003366' }}>Phone:</strong> +91 9123163206
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#003366' }}>Email:</strong> dhanbaddistrictkabaddi@gmail.com
          </p>
        </div>

        <div
          style={{
            fontSize: '8px',
            textAlign: 'center',
            margin: '2px 0 4px 0',
            color: '#444',
            wordWrap: 'break-word',
            lineHeight: 1.2,
          }}
        >
          <p style={{ margin: 0 }}>
              <strong style={{ color: '#003366' }}>Address:</strong> Retired Rly Colony, Gomoh, Dhanbad, Jharkhand 828401
            </p>
        </div>

        {/* Secretary Signature */}
        <div
          style={{
            marginTop: '10px',
            marginBottom: '2px',
            textAlign: 'left',
            fontSize: '7.4px',
            color: '#444',
            minHeight: '18px',
          }}
        >
          <div
            style={{
              borderTop: '0.6px solid #999',
              width: '70%',
              margin: '0 auto 2px auto',
            }}
          />
          <p
            style={{
              margin: 0,
              textAlign: 'center',
              fontWeight: 500,
              letterSpacing: '0.2px',
            }}
          >
            Secretary Signature
          </p>
        </div>

        {/* Membership & Contact Info - right below signature (orange line) */}
        <div
          style={{
            fontSize: '7.4px',
            textAlign: 'center',
            color: '#555',
            marginTop: '4px',
            paddingTop: '2px',
            borderTop: '1px solid #FF8F00',
            lineHeight: 1.2,
            wordWrap: 'break-word',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#003366' }}>Member Name:</strong> {data.name}
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#003366' }}>ID No:</strong> {data.idNo}
          </p>
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
