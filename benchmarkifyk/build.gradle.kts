import org.jetbrains.compose.desktop.application.dsl.TargetFormat
import org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension

plugins {
    kotlin("multiplatform")
    kotlin("plugin.compose")
    id("org.jetbrains.compose")
}

repositories {
    mavenCentral()
    maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
    google()
}

kotlin {
    js(IR) {
        browser()
        binaries.executable()
    }
    sourceSets {
        val jsMain by getting {
            kotlin.srcDir("src/main/kotlin")
            resources.srcDir("src/main/resources")

            dependencies {
                implementation(compose.html.core)
                implementation(compose.runtime)
                implementation(npm("tailwindcss", "3.4.6"))
                implementation(npm("tailwindcss-animate", "1.0.7"))
                implementation(npm("tailwindcss-merge", "2.4.0"))
                implementation(npm("upshedcn", File("./shedcn/build")))
            }
        }
    }
}
