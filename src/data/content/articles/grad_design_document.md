# MEDICAL DEVICE DESIGN FOR PATIENT MONITORING SYSTEM

## FOREWORD

Medical monitoring devices are developing and becoming more digital every day, but the development and testing costs of these devices are still high and open to improvement. A complete patient monitoring system requires both reliable hardware for reliable patient data acquisition and modern software for visualization and analysis. This project aims to design a comprehensive patient monitoring solution that combines hardware connectivity options with modular software architecture.

Our system is designed to work across multiple hardware platforms - from dedicated single-board computers to consumer tablets (Windows, Android, and ipadOS) with appropriate hardware adapter connections. This flexibility allows for widespread compatibility. The software components are designed to be modular, allowing for fast development and deployment. System intended to be naturally one application for actual data aquisition, showing on mobile device and a widely monitoring system for multiple patients remotely.

Through this integration of hardware and software design, our goal to take R&D activities in medical device development one step further while providing practical solutions for modern healthcare environments.

## ABSTRACT

This design study presents a comprehensive patient monitoring system that integrates custom hardware interfaces with a flexible, modular software architecture. By creating a cross-platform solution, we enable healthcare providers to deploy monitoring capabilities across various hardware configurations while maintaining consistent data acquisition, processing, and visualization.

The system consists of two primary components:

1. **Hardware Interface Layer**: A modular adapter system that connects to patients via standard medical sensors and provides digital signal processing capabilities. This layer is designed with flexibility in mind, supporting connections to single-board computers, Windows/Linux systems, and mobile devices (Android/ipads) through local wifi network.

2. **Software Platform**: Built using C++ with the Qt Framework to ensure cross-platform compatibility. The software implements a modular architecture with clear separation between data acquisition, processing, visualization, and alerting subsystems.

The advantages of our comprehensive approach include:
- Hardware flexibility allowing deployment on multiple platforms
- Modular software architecture enabling rapid feature development
- Support for standard medical sensors
- Real-time visualization with configurable displays
- Local and networked operation modes
- Simulation capabilities for removing requirements of phsical simulator devices

## CHAPTER 1: INTRODUCTION

### 1.1 System Overview

1. **Hardware Components**: A set of modular interfaces that connect to medical sensors and provide the necessary signal acquisition, conditioning, and analog-to-digital conversion.
   - Dedicated single-board computers (Raspberry Pi, custom SOM solutions)
   - Windows/Linux tablets and laptops
   - Android and iOS tablets via appropriate interfaces

2. **Software Component**: A cross-platform application developed in C++ using the Qt Framework, providing visualization, data processing, alerting, and connectivity features. The software is designed with modularity at its core, allowing for customization.

This approach allows healthcare facilities to choose the most appropriate hardware configuration for their specific needs while maintaining consistent software reliability and user experience across all platforms.

## CHAPTER 2: SYSTEM ARCHITECTURE

The architecture integrates hardware and software components through clearly defined interfaces and communication protocols. This design ensures modularity and flexibility while maintaining the reliability required for medical applications.

### 2.1 Hardware Components

The hardware layer consists of several key components:

#### 2.1.1 Patient Interface Modules
This module connects directly to the patient through standard medical sensors and leads. It includes:
- ECG leads with appropriate isolation and filtering
- SPO2 sensor interface with optical signal processing
- Temperature sensor inputs
- Invasive and non-invasive blood pressure connections
- Respiratory monitoring interfaces

#### 2.1.2 Signal Processing Module
This unit handles the initial processing of raw sensor data:
- Analog filtering and noise reduction
- Signal amplification
- Analog-to-Digital conversion at appropriate sample rates
- Initial digital filtering and artifact removal

The processing unit is is separate and most important module therefore development of this module is not area of this project currently.

#### 2.1.3 Computing Platform Options
The system supports multiple computing platforms:

**Dedicated Single Board Computer**
- Custom SOM-based solution with medical-grade components
- Raspberry Pi or similar SBC for lower-cost implementations
- Power management module for battery operation if that doesn't come with the board
- Dedicated display or HDMI output

**Tablet Interface Module**
- USB-C connection for Windows/Android tablets
- Bluetooth interface option for not realtime data transfer
- Power delivery and management through tablet connection

### 2.2 Software Platform

#### 2.2.1 C++ Platform

We chose C++ as the primary development language due to its performance characteristics, cross-platform capabilities, and suitability for embedded systems. C++ provides:
- High performance for real-time data processing
- Efficient memory management critical for medical applications
- Object-oriented programming paradigm enabling modular design
- Cross-platform compatibility across our target systems

Current rust programming language is not mature enough for cross compatibilitiy, and not mature enought for gui development therefore we stick with c++ platform but in our experiments we noticed that rust might speed up development without comprimising performance.

#### 2.2.2 Qt Framework

The Qt Framework provides essential tools for building the interface and guarantees safety which is the single most important feature for medical industry, also has listed benefits:
- Cross-platform UI components that maintain consistent look and feel
- Signal-slot mechanism for safe and efficient communication
- Hardware abstraction layer for accessing platform-specific features
- Built-in support for multiple deployment targets

#### 2.2.3 Qt Widgets

For more robust interface components, particularly those requiring direct interaction with data processing systems, we use Qt Widgets instead of QML for gui:
- Support Qt STL and containers directly
- Provide efficient rendering of complex data visualizations
- Enable detailed control over UI behavior
- Maintain consistent performance across platforms
- Reduces complexity of ui development(for our experience)

Since we don't need the most modern ui -which can be achievable with Qt-Widgets with embedding html/css into widgets - we decided Qt-Widgets are better choice. With this approach we also mostly avoid complexity of qt meta object system.

### 2.3 Integration and Communication Protocols

The hardware and software components communicate through several standardized protocols:

#### 2.3.1 USB Communication
For direct connections to computers and most tablets, offering:
- High bandwidth for multi-channel data
- Standard driver implementation
- Power delivery capabilities

#### 2.3.2 Bluetooth Interface
For wireless connections where appropriate:
- Non-critical data communications

#### 2.3.3 Wifi Network
For mobilized monitoring scenarios:
- With newer wifi versions it is now possible to show realtime data with acceptable latency(under 50 miliseconds)
- Critical data communication possible in realtime for multiple patient monitoring

## CHAPTER 3: IMPLEMENTATION DETAILS

### 3.1 Hardware Interfaces

#### 3.1.1 Signal Acquisition Circuit
The analog front end provides sophisticated signal conditioning:
- Low-noise amplifiers optimized for biomedical signals

#### 3.1.2 Digital Interface
The digital interface bridges analog signals to the computing platform:
- Multiple interface options (SPI, USB, Bluetooth) depending on configuration

### 3.2 Software Modules

The display part of the application consists of multiple modules.

#### 3.2.1 Waveform Visualization Module

This module handles real-time drawing of waveforms on screen based on incoming data, including these features:
- Multi-lead support with synchronized timing
- Color-coded waveforms for different physiological parameters
- Zoom and scale functionality for detailed analysis
- Historical data buffering with review capabilities

The module is designed with performance optimization to handle multiple high-frequency data streams simultaneously.

#### 3.2.2 Numerical Parameter Display Module

This module presents the numerical representation of physiological data, including:
- Current values with units
- Alarm limits
- Trends showing parameter direction
- Color-coding based on parameter status (normal, warning, critical)

#### 3.2.3 Module Architecture

Both modules are implemented using Qt Widgets with dynamic behavior controlled through the signal-slot mechanism. The modules are designed following the builder pattern to ensure maximum flexibility and reusability.

This pattern allows each component to be constructed with specific parameters appropriate for different physiological signals while maintaining a consistent interface.

The signal-slot mechanism enables real-time updating without tight coupling between data sources and visualization components.

The modules are responsive to screen size changes, automatically adjusting their display properties for optimal viewing on different hardware platforms.

### 3.3 Data Acquisition and Processing

#### 3.3.1 Signal Processing Pipeline
Raw signals undergo multiple processing stages:
- Initial filtering and artifact removal(mostly done by analog-to-digital hardware or another similar system)
- Parameter extraction (e.g., heart rate from ECG)
- Alarm condition evaluation
- Data storage for trending and review

#### 3.3.2 Data Management
The system implements sophisticated data management:
- Circular buffers for continuous monitoring
- Secure patient data handling compliant with protective regulations(record removal won't be possible)

#### 3.3.3 Simulation Capabilities
For training and development purposes, the system includes:
- Realistic patient simulation with configurable parameters
- Scenario-based testing with programmed events
- Real-time parameter manipulation
- Record and replay functionality of actual patient data

## CHAPTER 4: TESTING AND VALIDATION

### 4.1 Hardware Testing

Hardware components undergo rigorous testing to ensure reliability:
- Signal fidelity verification with known reference signals(already certified if mobile devices chosen except cables)
- Environmental testing (temperature, humidity, vibration already certified if mobile devices chosen)
- Longevity testing

### 4.2 System Relience Testing

The complete system undergoes integration testing:
- End-to-end data flow verification
- Latency measurements for real-time performance
- Alarm response timing validation
- Recovery from communication interruptions

## CHAPTER 5: CONCLUSION AND FUTURE WORK

We have tried to design a comprehensive patient monitoring system that combines flexible hardware options with a modular software architecture. With listed features:

1. Platform independence through cross-platform software
2. Modular software architecture
3. Visualization components
4. Real-time data processing

Moving forward, we plan to enhance the system with:
- Machine learning for predictive alerting
- Expanded networking capabilities
- Enhanced mobile device support
- Cloud integration for data analytics and remote monitoring

The system provides a foundation for patient monitoring that balances the requirements of medical reliability with the flexibility and fast development capabilities.