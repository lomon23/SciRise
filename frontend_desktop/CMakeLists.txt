cmake_minimum_required(VERSION 3.16)
project(SciRise VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 COMPONENTS Core Gui Widgets Network WebSockets WebEngineWidgets WebChannel REQUIRED)

include_directories(src)

file(GLOB_RECURSE SOURCES 
    "src/*.cpp" 
    "src/*.h" 
    "src/*.ui"
)

add_executable(SciRise ${SOURCES})

target_link_libraries(SciRise PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
    Qt6::Network
    Qt6::WebSockets
    Qt6::WebEngineWidgets
    Qt6::WebChannel
)