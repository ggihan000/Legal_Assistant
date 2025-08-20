package com.gigavision.legal_assistant.services;

import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TranslationService {

    private final Translate translate;

    public TranslationService(@Value("${google.translate.api-key}") String apiKey) {
        this.translate = TranslateOptions.newBuilder().setApiKey(apiKey).build().getService();
    }

    public String translateText(String text, String targetLanguage) {
        // Perform the translation
        Translation translation = translate.translate(
                text,
                Translate.TranslateOption.targetLanguage(targetLanguage)
        );
        return translation.getTranslatedText();
    }
}
