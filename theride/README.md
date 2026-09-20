# TheRide 🚗💨
### On-Demand Professional Chauffeur Service for Your Personal Car

[![AWS Hackathon](https://img.shields.io/badge/AWS%20x%20WeMakeDevs-Bharat%20Builds%20Hackathon-FF9900?logo=amazon-aws&logoColor=white)](https://wemakedevs.org)
[![Track](https://img.shields.io/badge/Track-Ship%20It-blue.svg)](#track-ship-it)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Active-brightgreen.svg)](https://ais-pre-ofi3vpvmbe5fzwij3xn3oi-546660926804.asia-southeast1.run.app)
[![Built by](https://img.shields.io/badge/Author-Mahee%20Tailor-6366f1.svg)](#author)

> **Live Demo URL:** [https://ais-pre-ofi3vpvmbe5fzwij3xn3oi-546660926804.asia-southeast1.run.app](https://ais-pre-ofi3vpvmbe5fzwij3xn3oi-546660926804.asia-southeast1.run.app)

---

## 📌 Table of Contents
- [Problem Statement](#-problem-statement)
- [The Solution](#-the-solution)
- [Hackathon Track: Ship It](#-hackathon-track-ship-it)
- [Key Features & User Journey](#-key-features--user-journey)
- [AWS Cloud Architecture](#-aws-cloud-architecture)
- [Architecture Flow Diagram](#-architecture-flow-diagram)
- [Tech Stack](#-tech-stack)
- [Getting Started Locally](#-getting-started-locally)
- [Project Structure](#-project-structure)
- [Security & Trust Model](#-security--trust-model)
- [Author & Acknowledgements](#-author--acknowledgements)

---

## 🎯 Problem Statement
In urban India (Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Pune), millions of families and working professionals own comfortable personal vehicles. However, they face significant hurdles:
- **Daily Commute Exhaustion:** Bumper-to-bumper traffic causes severe mental and physical driving fatigue.
- **Nighttime & Social Outings:** Strict drunk-and-drive regulations make late-night returns difficult.
- **High Aggregator Costs:** Ride-hailing aggregators charge surge pricing for small, uncomfortable cabs while the owner's personal car sits parked and depreciating.
- **Outstation & Highway Fatigue:** Long-distance driving requires sustained vigilance, taking the joy out of family vacations.

---

## 💡 The Solution
**TheRide** flips this paradigm. Instead of booking a third-party cab, users hire **verified, professional chauffeurs on demand to drive their own vehicle**. 

Owners enjoy the comfort, cleanliness, and safety of their personal car without the stress of navigating roads, parking, or highway traffic.

---

## 🏆 Hackathon Track: "Ship It"
Built specifically for the **AWS x WeMakeDevs "First Commit | Bharat Builds" Hackathon** under the **"Ship It"** track:
- **Real Bharat Utility:** Solves an everyday urban mobility dilemma for car owners across tier-1 and tier-2 Indian cities.
- **Production-Ready Implementation:** Features an end-to-end 3-step user workflow, OTP validation, interactive booking calculation, and digital vehicle handover inspection.
- **Deep AWS Integration Blueprint:** Designed to leverage scalable AWS serverless cloud services.

---

## 🚀 Key Features & User Journey

### 1. Step 1: Immersive Splash Screen
- Clean, brand-focused entry animation highlighting the signature blue identity and vehicle badge.
- Automatic smooth opacity fade-out transition after 2.5 seconds (with a quick skip option).

### 2. Step 2: Dedicated Authentication (Login / Sign Up)
- Full-page authentication with instant toggle between **Login** and **Create Account**.
- Mobile/username sign-in powered by an OTP verification workflow.
- Includes default home address preferences and ability to book for oneself or family members.
- Includes a quick-test OTP auto-fill button (`8492`) for frictionless evaluation.

### 3. Step 3: Complete Booking Dashboard
- **Three Flexible Service Modes:**
  - **One-Way Drops:** Fast point-to-point urban transit.
  - **Round Trips:** Intercity and outstation journeys with return leg management.
  - **Hourly Rentals:** Multi-stop packages for shopping, errands, weddings, or corporate days.
- **Gearbox & Powertrain Matching:**
  - Matches chauffeurs experienced with specific transmissions: **Manual**, **Automatic**, or **Electric (EV)**.
- **Pre-Booking Fare Transparency:**
  - Real-time base rate, per-kilometer charges, night charges, and vehicle insurance add-on calculations.

### 4. Step 4: Digital Vehicle Handover Inspection
- Eliminates liability disputes before handing over car keys.
- Step-by-step 4-point verification:
  - 📊 Starting Odometer Reading
  - ⛽ Fuel / Battery Percentage Check
  - 🔍 Pre-existing Dent & Scratch Visual Tagging
  - 👜 Belongings Check Confirmation

### 5. Step 5: Live Dispatch Telemetry & Driver Profile
- Assigned driver card with rating, trip history, police-verification badge, and direct call/WhatsApp triggers.
- 4-digit ride start OTP verification to ensure the right driver takes the wheel.
- Active ride telemetry with emergency SOS broadcast button and in-app support.

---

## ☁️ AWS Cloud Architecture

TheRide is architected around the AWS Serverless and Managed Services ecosystem for high availability, low latency, and cost-efficient scale-to-zero operations:

| AWS Service | Architecture Responsibility |
| :--- | :--- |
| **AWS Amplify Hosting** | Edge-accelerated CI/CD hosting, automatic HTTPS, branch previews, and instant DNS routing for the frontend. |
| **Amazon Cognito** | Manages user pools, token generation, mobile OTP validation, and passwordless authentication sessions. |
| **Amazon API Gateway** | Secure REST & WebSocket API gateway handling request validation, rate limiting, and CORS routing. |
| **AWS Lambda** | Serverless compute executing driver matchmaking algorithms, dynamic pricing calculation, and ride state transitions. |
| **Amazon DynamoDB** | Ultra-low latency NoSQL database storing active ride telemetry, chauffeur profiles, bookings, and handover records. |
| **Amazon Location Service** | Handles geolocation, reverse geocoding of pickup points, route calculation, geofencing, and live driver tracking. |
| **Amazon SNS (Simple Notification Service)** | Sends real-time SMS alerts for OTP dispatch, driver arrival pings, and emergency SOS triggers. |
| **Amazon S3** | Encrypted cloud bucket storage for pre/post-trip vehicle handover inspection photos and chauffeur verification documents. |
| **Amazon CloudWatch & AWS WAF** | Centralized logging, latency performance tracking, and API protection against DDoS and automated attacks. |

---

## 📐 Architecture Flow Diagram

```
[ User Browser / Mobile Device ]
              │
              ▼
    [ AWS Amplify Hosting ] (Edge CDN & Assets)
              │
    ┌─────────┴─────────┐
    ▼                   ▼
[ Amazon Cognito ]  [ Amazon API Gateway ]
 (User Auth & OTP)      │
                        ▼
                 [ AWS Lambda ] (Serverless Business Logic)
                  ├── Fare Calculator
                  ├── Chauffeur Matchmaker
                  └── Handover Verification
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
[ Amazon DynamoDB ] [ Amazon S3 ] [ Amazon Location Service ]
  (Rides & Users)   (Inspection Photos)  (Geofencing & Routes)
       │
       ▼
  [ Amazon SNS ] ──► SMS Alerts & Driver Pings
```

---

## 💻 Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS (modern, accessible, mobile-first utility classes)
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Cloud Architecture:** Amazon Web Services (AWS) Serverless
- **Package Archive:** Standalone exportable ZIP bundled in `public/theride-source-code.zip`

---

## 🛠️ Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/the-ride.git
   cd the-ride
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The application will boot at `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
the-ride/
├── public/
│   ├── theride-source-code.zip    # Exportable project zip
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── SplashScreen.tsx       # Step 1: Full-screen branded splash
│   │   ├── AuthScreen.tsx         # Step 2: Dedicated login & OTP verification
│   │   ├── BookingForm.tsx        # Step 3: Service mode, vehicle & preferences
│   │   ├── ActiveRideTracker.tsx  # Step 4: Driver telemetry & handover checks
│   │   ├── BookingsList.tsx       # Ride history & receipt view
│   │   ├── AuthModal.tsx          # Quick profile & address settings
│   │   ├── HackathonGuideModal.tsx# AWS Architecture & Hackathon modal
│   │   └── CompanyContactModal.tsx# Corporate support & driver onboarding
│   ├── data/
│   │   └── mockData.ts            # Verified driver profiles & rate cards
│   ├── types.ts                   # TypeScript interfaces & domain models
│   ├── App.tsx                    # Root navigation flow controller
│   └── main.tsx                   # React root entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛡️ Security & Trust Model

1. **Police-Verified Drivers:** 100% background checks, Aadhaar identity verification, and commercial driving badge enforcement.
2. **Transmission Certification:** Drivers are vetted specifically on manual clutch control, dual-clutch automatics, and EV regenerative braking.
3. **Pre-Ride Handover Audit:** Cryptographically timestamped digital vehicle condition logs prevent false damage claims.
4. **Emergency SOS & Support:** Single-tap emergency hotline connection with instant location SMS dispatch via Amazon SNS.

---

## 👤 Author & Acknowledgements

- **Author:** Mahee Tailor
- **Hackathon:** AWS x WeMakeDevs *"First Commit | Bharat Builds"*
- **Track:** **Ship It**
- **Live Deployment:** [https://ais-pre-ofi3vpvmbe5fzwij3xn3oi-546660926804.asia-southeast1.run.app](https://ais-pre-ofi3vpvmbe5fzwij3xn3oi-546660926804.asia-southeast1.run.app)

*Thank you to AWS and the WeMakeDevs team for organizing Bharat Builds!*
