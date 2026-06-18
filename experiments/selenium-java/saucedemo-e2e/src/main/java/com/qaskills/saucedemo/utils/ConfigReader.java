package com.qaskills.saucedemo.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public final class ConfigReader {

    private static final Properties PROPERTIES = new Properties();

    static {
        try (InputStream input = ConfigReader.class.getClassLoader()
                .getResourceAsStream("config.properties")) {
            if (input == null) {
                throw new IllegalStateException("config.properties not found");
            }
            PROPERTIES.load(input);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to load config.properties", e);
        }
    }

    private ConfigReader() {
    }

    public static String getProperty(String key) {
        String value = PROPERTIES.getProperty(key);
        if (value == null) {
            throw new IllegalArgumentException("Missing config property: " + key);
        }
        return value;
    }

    public static int getTimeoutSeconds() {
        return Integer.parseInt(getProperty("default.timeout.seconds"));
    }
}
