{
  "targets": [
    {
      "target_name": "screensnap_capture",
      "type": "shared_library",
      "sources": [
        "ScreenCapture/ScreenCapture.swift"
      ],
      "conditions": [
        ["OS=='mac'", {
          "xcode_settings": {
            "OTHER_SWIFT_FLAGS": [
              "-import-objc-header", "<(module_root_dir)/bridge/capture-bridge.h"
            ],
            "SWIFT_VERSION": "5.9",
            "MACOSX_DEPLOYMENT_TARGET": "12.3",
            "CLANG_ENABLE_MODULES": "YES",
            "SWIFT_OBJC_BRIDGING_HEADER": "<(module_root_dir)/bridge/capture-bridge.h",
            "LD_RUNPATH_SEARCH_PATHS": [
              "@loader_path",
              "@executable_path/../Frameworks"
            ]
          },
          "libraries": [
            "-framework ScreenCaptureKit",
            "-framework CoreGraphics",
            "-framework Foundation"
          ],
          "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
          ],
          "defines": [
            "NAPI_VERSION=8",
            "NAPI_DISABLE_CPP_EXCEPTIONS"
          ]
        }]
      ]
    },
    {
      "target_name": "screensnap_ocr",
      "type": "shared_library",
      "sources": [
        "VisionOCR/TextRecognition.swift"
      ],
      "conditions": [
        ["OS=='mac'", {
          "xcode_settings": {
            "OTHER_SWIFT_FLAGS": [
              "-import-objc-header", "<(module_root_dir)/bridge/ocr-bridge.h"
            ],
            "SWIFT_VERSION": "5.9",
            "MACOSX_DEPLOYMENT_TARGET": "12.0",
            "CLANG_ENABLE_MODULES": "YES",
            "SWIFT_OBJC_BRIDGING_HEADER": "<(module_root_dir)/bridge/ocr-bridge.h"
          },
          "libraries": [
            "-framework Vision",
            "-framework CoreGraphics",
            "-framework Foundation"
          ],
          "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
          ],
          "defines": [
            "NAPI_VERSION=8",
            "NAPI_DISABLE_CPP_EXCEPTIONS"
          ]
        }]
      ]
    },
    {
      "target_name": "screensnap_audio",
      "type": "shared_library",
      "sources": [
        "AudioCapture/AudioCapture.swift"
      ],
      "conditions": [
        ["OS=='mac'", {
          "xcode_settings": {
            "OTHER_SWIFT_FLAGS": [
              "-import-objc-header", "<(module_root_dir)/bridge/audio-bridge.h"
            ],
            "SWIFT_VERSION": "5.9",
            "MACOSX_DEPLOYMENT_TARGET": "12.0",
            "CLANG_ENABLE_MODULES": "YES",
            "SWIFT_OBJC_BRIDGING_HEADER": "<(module_root_dir)/bridge/audio-bridge.h"
          },
          "libraries": [
            "-framework CoreAudio",
            "-framework AudioToolbox",
            "-framework Foundation"
          ],
          "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
          ],
          "defines": [
            "NAPI_VERSION=8",
            "NAPI_DISABLE_CPP_EXCEPTIONS"
          ]
        }]
      ]
    }
  ]
}
