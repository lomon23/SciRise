cmake_minimum_required(VERSION 3.10)
project(QtBaseProject)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 REQUIRED COMPONENTS Widgets Network)

add_executable(QtBaseProject
    src/main.cpp
    
    src/core/network/ApiClient.cpp
    src/core/network/ApiClient.h
    
    src/core/auth/AuthServise.cpp
    src/core/auth/AuthServise.h
    src/core/auth/TokenManager.cpp
    src/core/auth/TokenManager.h
    
    src/ui/auth/LoginForm.h
    src/ui/auth/LoginForm.cpp
)

target_include_directories(QtBaseProject PRIVATE
    src/core/network
    src/core/auth
    src/ui/auth
)

target_link_libraries(QtBaseProject Qt6::Widgets Qt6::Network)
