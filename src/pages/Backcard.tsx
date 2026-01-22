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
      {/* Watermark (larger, still subtle) */}
      <img
        src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png"
        alt="DDKA Watermark"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, 10%)',
          width: '140px',
          height: 'auto',
          opacity: 0.07,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Top Header - Deep Blue with Logos and Text */}
      <div
        style={{
          background: 'linear-gradient(135deg, #00579B, #003366)',
          color: '#ffffff',
          padding: '7px 9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <img
          src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767429051/WhatsApp_Image_2026-01-03_at_1.57.17_PM_qg7rs3.jpg"
          alt="Jharkhand State Kabaddi Association"
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            objectFit: 'contain',
            backgroundColor: 'white',
            padding: '2px',
          }}
        />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '0.3px',
            }}
          >
            Dhanbad District
          </div>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 600,
              opacity: 0.95,
              lineHeight: 1.1,
            }}
          >
            Kabaddi Association
          </div>
        </div>
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
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: '6px 8px 96px 8px', // increased bottom padding to move content higher further
          boxSizing: 'border-box',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          fontSize: '8px',
          color: '#333',
          lineHeight: 1.2,
        }}
      >
        <h4
          style={{
            fontSize: '9.5px',
            fontWeight: 600,
            color: '#003366',
            marginBottom: '1px',
            textAlign: 'center',
          }}
        >
          About DDKA
        </h4>
        <p
          style={{
            textAlign: 'center',
            marginBottom: '2px',
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
            margin: '0 0 4px 0',
          }}
        >
          <img
            src={qrUrl}
            alt="QR Code"
            style={{
              width: '60px',
              height: '60px',
              border: '1.2px solid #004A99',
              borderRadius: '2.5px',
              margin: '0 auto 6px auto',
              display: 'block',
              backgroundColor: '#fff',
            }}
          />
          <p
            style={{
              fontSize: '7.2px',
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
            fontSize: '6.2px',
            textAlign: 'center',
            margin: '2px 0 0 0',
            paddingTop: '3px',
            borderTop: '1px dashed #004A99',
            color: '#444',
            lineHeight: 1.05,
          }}
        >
          <p title={'+91 9123163206'} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
            <strong style={{ color: '#003366' }}>Phone:</strong> +91 9123163206
          </p>
          <p title={'dhanbaddistrictkabaddi@gmail.com'} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
            <strong style={{ color: '#003366' }}>Email:</strong> dhanbaddistrictkabaddi@gmail.com
          </p>
        </div>

        <div
          style={{
            fontSize: '6.2px',
            textAlign: 'center',
            margin: '2px 0 4px 0',
            color: '#444',
            lineHeight: 1.05,
          }}
        >
          <p title={'Retired Rly Colony, Gomoh, Dhanbad, Jharkhand 828401'} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
              <strong style={{ color: '#003366' }}>Address:</strong> Retired Rly Colony, Gomoh, Dhanbad, Jharkhand 828401
            </p>
        </div>

        {/* Signatures: Secretary & Coach */}
        <div
          style={{
            marginTop: '10px',
            marginBottom: '2px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ width: '48%', textAlign: 'center', fontSize: '7.4px', color: '#444' }}>
            <img
              src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1768749991/Mintoo_Thakur_Sign_cg8gxm.png"
              alt="Secretary Signature"
              style={{ width: '80%', maxHeight: '26px', objectFit: 'contain', display: 'block', margin: '0 auto 6px auto' }}
            />
            <div style={{ borderTop: '0.6px solid #999', width: '70%', margin: '0 auto 4px auto' }} />
            <p style={{ margin: 0, fontWeight: 500, letterSpacing: '0.2px' }}>
              Mintoo Thakur
              <br />
              <span style={{ fontSize: '6px', fontWeight: 400 }}>Secretary</span>
            </p>
          </div>

          <div style={{ width: '48%', textAlign: 'center', fontSize: '7.4px', color: '#444' }}>
            <img
              src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1768749926/Pappu_Kumar_Yadav_Sign_bj2xlm.png"
              alt="Coach Signature"
              style={{ width: '80%', maxHeight: '26px', objectFit: 'contain', display: 'block', margin: '0 auto 6px auto' }}
            />
            <div style={{ borderTop: '0.6px solid #999', width: '70%', margin: '0 auto 4px auto' }} />
            <p style={{ margin: 0, fontWeight: 500, letterSpacing: '0.2px' }}>
              Pappu Kumar Yadav
              <br />
              <span style={{ fontSize: '6px', fontWeight: 400 }}>Coach</span>
            </p>
          </div>
        </div>

        {/* Membership & Contact Info - right below signature (orange line) */}
        <div
          style={{
            fontSize: '6.4px',
            textAlign: 'center',
            color: '#555',
            marginTop: '2px',
            paddingTop: '2px',
            borderTop: '1px solid #FF8F00',
            lineHeight: 1.02,
          }}
        >
          <p title={data.name} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
            <strong style={{ color: '#003366' }}>Member Name:</strong> {data.name}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
            <div style={{ color: '#003366', fontWeight: 500, fontSize: '4.5px' }}>{data.idNo}</div>
          </div>
          <p style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>If found, please return to DDKA office.</p>
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
