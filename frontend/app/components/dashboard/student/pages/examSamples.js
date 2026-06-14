export const listeningSample = {
    audioUrl: "/audio/ielts-listening-sample.mp3",
    questions: [
        {
            id: "listening-1",
            type: "multiple_choice",
            text: "What is the main reason the student visits the accommodation office?",
            options: ["To change rooms", "To report a repair", "To ask about fees", "To book a tour"],
        },
        {
            id: "listening-2",
            type: "short_answer",
            text: "Write the name of the building mentioned by the officer.",
        },
        {
            id: "listening-3",
            type: "multiple_choose",
            text: "Which two facilities are available after 8 PM?",
            options: ["Computer room", "Laundry", "Library desk", "Gym", "Kitchen"],
        },
    ],
};

export const readingSample = {
    passage: {
        title: "The Rise of Urban Rooftop Gardens",
        content: (
            <>
                <p>
                    In many large cities, unused rooftops are being transformed into compact gardens. These spaces can reduce heat, collect rainwater,
                    and provide residents with a quiet place to grow vegetables.
                </p>
                <p>
                    Supporters argue that rooftop gardening also strengthens community life because neighbours often work together to maintain the
                    plants. However, critics note that older buildings may require structural checks before heavy planters or water tanks are added.
                </p>
                <p>
                    Despite these concerns, several city councils now offer small grants to building owners who create green spaces above street level.
                    Early results suggest that even modest gardens can lower indoor temperatures during summer.
                </p>
            </>
        ),
    },
    questions: [
        {
            id: "reading-1",
            type: "true_false_not_given",
            text: "Rooftop gardens can help manage rainwater.",
        },
        {
            id: "reading-2",
            type: "multiple_choice",
            text: "What concern do critics raise about rooftop gardens?",
            options: ["They attract too many visitors", "They may need building safety checks", "They are illegal in most cities", "They use no water"],
        },
        {
            id: "reading-3",
            type: "short_answer",
            text: "What do some city councils offer to building owners?",
        },
    ],
};

export const writingSample = {
    taskLabel: "Writing Task 2",
    instruction: "You should spend about 40 minutes on this task. Write at least 250 words.",
    prompt: "Some people believe that social media has a negative impact on society. Others think it has made the world better. Discuss both views and give your own opinion.",
    tags: ["250+ words", "40 minutes", "Discuss both views"],
};
