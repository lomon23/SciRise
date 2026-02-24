cmake_minimum_required(VERSION 3.16)
project(WeatherApp VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 REQUIRED COMPONENTS Core Gui Widgets Network)

add_executable(WeatherApp
    main.cpp
    modules/ui/WeatherUI.cpp
    modules/ui/WeatherCard.cpp
    modules/network/WeatherNetwork.cpp
    modules/ui/WeatherUI.h
    modules/ui/WeatherCard.h
    modules/network/WeatherNetwork.h
)

target_link_libraries(${PROJECT_NAME} PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
    Qt6::Network 
)
