# DetectIt: A C++/Qt PoC for Real-time YOLOv8 Object Detection

## Introduction: Proving the Concept

The `DetectIt` project developed to Proof-of-Concept demonstrating of real-time object detection on a standard desktop computer. In this project yolo object detection model used with C++/Qt. The main motivation behind this project was not to create a production-ready application, but rather to explore the feasibility with the improved new versions of technologies like yolo, qt framework.

## Functionality

1.  **Webcam Input:** Connects to the default system webcam using OpenCV (`cv::VideoCapture`) to capture live video frames.
2.  **Real-time Object Detection:** Processes each captured frame using the YOLOv8n model loaded via ONNX Runtime. YOLOv8n (nano) is chosen for its speed, which make it suitable for poor hardware too.
3.  **Visual Overlay:** Displays the processed video feed within a Qt GUI window. Detected objects are highlighted with bounding box.
4.  **Adjustable Thresholds:** Sliders within the GUI to dynamically adjust key detection parameters in real-time:
    *   **Confidence Threshold:** Filters detections based on the model's confidence in the classification.
    *   **Score Threshold:** Used during Non-Maximum Suppression (NMS) to filter boxes before overlap removal.
    *   **NMS Threshold:** Controls the degree of overlap allowed between bounding boxes for the same object during NMS.
5.  **Pause/Resume:** Allows the user to pause the live processing to inspect detections on a single frame and resume processing.
6.  **FPS Display & Status:** Shows the current processing Frames Per Second (FPS) and basic status updates (Initializing, Processing, Paused, Stopped, Error).

### Class Structure Diagram
```
+-------------------------------------------+
|               MainWindow                  |
+-------------------------------------------+
| - videoDisplayLabel: QLabel               |
| - startButton: QPushButton                |
| - stopButton: QPushButton                 |
| - pauseResumeButton: QPushButton          |
| - confidenceSlider: QSlider               |
| - scoreSlider: QSlider                    |
| - nmsSlider: QSlider                      |
| - isProcessing: std::atomic<bool>         |
| - isPaused: std::atomic<bool>             |
| - pipeline: DetectionPipeline             |
| - videoCapture: cv::VideoCapture          |
| - processingFuture: QFuture<void>         |
+-------------------------------------------+
| + startWebcam()                           |
| + stopWebcam()                            |
| + togglePauseResume()                     |
| + runDetectionLoop()                      |
| + handleFrameProcessed()                  |
| + onConfidenceSliderChanged()             |
| + onScoreSliderChanged()                  |
| + onNmsSliderChanged()                    |
+-------------------------------------------+
             |
             | uses
             v
+---------------------------------------------+
|           DetectionPipeline                 |
+---------------------------------------------+
| - onnxEnv: std::unique_ptr<Ort::Env>        |
| - onnxSession: std::unique_ptr<Ort::Session>|
| - settingsMutex: std::mutex                 |
| - classNames: std::vector<std::string>      |
| - confidenceThreshold: float                |
| - scoreThreshold: float                     |
| - nmsThreshold: float                       |
+---------------------------------------------+
| + initialize()                            |
| + processFrame()                          |
| + setConfidenceThreshold()                |
| + setScoreThreshold()                     |
| + setNmsThreshold()                       |
| - preprocessFrame()                       |
| - runInference()                          |
| - postprocessOutput()                     |
| - drawDetections()                        |
+-------------------------------------------+
             |
             | returns
             v
+-------------------------------------------+
|              Detection                    |
+-------------------------------------------+
| + box: cv::Rect                           |
| + score: float                            |
| + classId: int                            |
| + className: std::string                  |
+-------------------------------------------+
```

### Application Execution Flow
```
+---------------------+    +-------------------+    +----------------------+
|                     |    |                   |    |                      |
|  Application Start  +--->+  MainWindow      +--->+  Setup UI Components |
|  (main.cpp)         |    |  Construction     |    |                      |
|                     |    |                   |    |                      |
+---------------------+    +-------------------+    +----------------------+
                                                                |
                                                          User  v  clicks       
+----------------------+    +-------------------+    +----------------------+
|                      |    |                   |    |                      |
|  Display & UI Update +<---+  Frame Processing +<---+  Start Webcam Button|
|                      |    |                   |    |                      |
+----------------------+    +-------------------+    +----------------------+
   ^    |                           ^                           |
   |    |                           |                           v
   |    |                   +-------------------+    +----------------------+
   |    |                   |                   |    |                      |
   |    +------------------>+  Slider Parameter +--->+  Detection Pipeline  |
   |                        |  Adjustments      |    |  Initialize          |
   |                        |                   |    |                      |
   |                        +-------------------+    +----------------------+
   |                                                          |
   |                                                          v
   |                        +-------------------+    +----------------------+
   |                        |                   |    |                      |
   +------------------------+  frameReady       +<---+  Background Thread   |
                            |  Signal Emitted   |    |  runDetectionLoop    |
                            |                   |    |                      |
                            +-------------------+    +----------------------+
```

### Frame Processing Flow
```
+-------------------------+    +---------------------+    +------------------------+
|                         |    |                     |    |                        |
|  Webcam Frame Capture   +--->+  Preprocess Frame   +--->+  ONNX Model Load       |
|  (cv::VideoCapture)     |    |  Resize & Normalize |    |  (YOLOv8n)             |
|                         |    | 640x640  (0-1 range)|    |                        |
+-------------------------+    +---------------------+    +------------------------+
                                                                     |
                                                                     v
                                                          +------------------------+
                                                          |                        |
                                                          |  Postprocess Output    |
                                                          |  Parse & Filter        |
                                                          |  Results with NMS      |
                                                          +------------------------+
                                                                      |
                                                                      V
                                                          +------------------------+
                                                          | Filter by Confidence   |
                                                          | Threshold              |
                                                          +------------------------+
                                                                    |
                                                                    v
                                                          +------------------------+
                                                          | Apply Non-Maximum      |
                                                          | Suppression (NMS)      |
                                                          +------------------------+
                                                                     |
                                                                     v
+-----------------------+    +---------------------+      +------------------------+
|                       |    |                     |      |                        |
|  Display in UI        +<---+  Draw Detections    |+<---+| Scale boxes to         |
|  (QLabel)             |    |  (Boxes & Labels)   |      | original frame size    |
|                       |    |                     |      |                        |
+-----------------------+    +---------------------+      +------------------------+
```

## Conclusion

*   **Performance:** For real-time applications requiring high frame rates and low latency as possible, C++/Qt platform offers best. Direct access to native libraries (like ONNX Runtime C++ API), compiled code execution potentially achieving higher FPS and lower CPU/memory usage compared to an equivalent Python implementation, especially without significant Python-specific optimization (e.g., using C extensions)
*   **Resource Control:** C++ provides more control over system resources, which can be critical in embedded systems or resource limited environments.
*   **Integration:** Integrating with other C/C++ libraries or system APIs can be more direct.

For this PoC, C++/Qt was a viable choice, particularly if the goal was maximum performance or integration within a larger C++ ecosystem. It allowed direct use of the C++ APIs for Qt, OpenCV, and ONNX Runtime. However, achieving the same core functionality in Python with PyQt/PySide would likely have been faster from a development time perspective, thanks to the mature ML bindings. The performance difference might become noticeable under heavier loads or with more complex models, potentially favoring the C++ approach for demanding real-time scenarios.

The `DetectIt` project successfully demonstrates the integration required for a real-time C++/Qt object detection application using YOLOv8. While serving as a proof-of-concept, it provides a valuable starting point for anyone looking to build similar applications where the performance benefits of C++ might not outweigh the faster development cycles often associated with Python for ML tasks. The choice often depends on balancing development time and performance requirements. However, according to this proof of concept, if the hardware is not very weak, then developing an end-product on Python or another higher-level platform will be a more beneficial choice.