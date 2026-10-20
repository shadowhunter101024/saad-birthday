package com.abir.birthday;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class BirthdayController {

    @Value("${birthday.name}")
    private String name;

    @Value("${birthday.from}")
    private String from;

    @Value("${birthday.age:}")
    private String age;

    @Value("${birthday.date}")
    private String date;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("name", name);
        model.addAttribute("from", from);
        model.addAttribute("age", age);
        model.addAttribute("date", date);

        // ---- Edit these texts to make them more personal ----
        model.addAttribute("wishes", List.of(
                new Wish("🎂", "Aj shudhu tor din",
                        "Shara bochor to amra jhogra kori, kintu aj shob maf. Aj shudhu tor jonno, shudhu moja."),
                new Wish("🚀", "Tor shopno gulo",
                        "Tui jei jei shopno dekhis, ami chai shegulo ekdin shotti hok. Tui parbi, ami jani."),
                new Wish("😄", "Hashi ta thak",
                        "Jibone joto jai ashuk, tor ei hashi ta jeno kokhono na haray. Tui hashle bhalo lage."),
                new Wish("🤝", "Ami achi",
                        "Kothao atke gele ek call dibi. Bhai hishebe ami shob shomoy tor pashe achi, thakbo."),
                new Wish("🌙", "Ekta chhoto dua",
                        "Allah tore shustho rakhuk, shukhi rakhuk, ar tor moner moto ekta shundor jibon din.")
        ));

        model.addAttribute("goals", List.of(
                new Wish("💪", "Shustho thak", "Shorir ar mon duto-i bhalo thakuk."),
                new Wish("📚", "Boro hoye uth", "Jei lokkho niye cholchis, shetay pouchhe ja."),
                new Wish("✈️", "Ghur", "Notun notun jayga, notun notun manush — shob dekhish."),
                new Wish("😊", "Khushi thak", "Chinta kom, hashi beshi.")
        ));

        model.addAttribute("greeting", "প্রিয় সাদ, ❤️");

        model.addAttribute("letter", List.of(
                "দেখতে দেখতে তুই আরও এক বছর বড় হয়ে গেলি। তোর সাথে কাটানো ছোট ছোট মুহূর্ত, দুষ্টুমি আর হাসি-ঠাট্টাগুলো আমার কাছে ভীষণ প্রিয়। হয়তো সব স্মৃতি ছবিতে ধরে রাখা হয়নি, কিন্তু কিছু স্মৃতি মনের মধ্যে ঠিকই থেকে যায়।",
                "সময় বদলাবে, আমরা বড় হব, জীবনে অনেক ব্যস্ততা আসবে। কিন্তু তুই যত বড়ই হোস, আমার কাছে সবসময় আমার সেই ছোট ভাইটাই থাকবি। তোকে নিয়ে আমার চিন্তা, ভালোবাসা আর দোয়া সবসময় থাকবে।",
                "শুভ জন্মদিন, আমার ছোট ভাই। ❤️ জীবনে অনেক বড় হ, অনেক সুখী হ। তোর সব স্বপ্ন পূরণ হোক। আর মনে রাখিস, তোর এই বোনটা সবসময় তোর ভালো চায়। হয়তো প্রতিদিন বলা হয় না, কিন্তু তোকে নিজের ছোট ভাই হিসেবে পেয়ে আমি সত্যিই অনেক খুশি। 🫂❤️"
        ));

        return "index";
    }

    public record Wish(String icon, String title, String text) {}
}
