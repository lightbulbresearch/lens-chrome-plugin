// content.js

// declare a variable to stopre the mapping between website and queryselector element
var websiteToQuerySelector = {
    "www.news24.com": ".article__body",
    "www.breitbart.com": ".entry-content",
    "www.infowars.com": ".entry-content",
    "www.dailycaller.com": ".article-content",
    "www.theblaze.com": ".article-content",
    "www.washingtontimes.com": ".article-text",
    "www.westernjournal.com": ".article-content",
    "www.newsmax.com": ".article-body",
    //"www.bbc.com": ".story-body__inner",
    "www.bbc.com": "#main-content",
    "www.cnn.com": ".zn-body__paragraph",
    "www.foxnews.com": ".article-body",
    "www.nytimes.com": ".css-158dogj",
    "www.washingtonpost.com": ".article-body",
    "www.wsj.com": ".article-content",
    "www.usatoday.com": ".gnt_ar_b_p",
    "www.nbcnews.com": ".article-body__content",
    "www.bloomberg.com": ".body-copy-v2",
    "www.npr.org": ".storytext",
    "www.reuters.com": ".StandardArticleBody_body",
    "www.apnews.com": ".Article",
    "www.cbsnews.com": ".content__body",
    "www.abcnews.go.com": ".Article__Content",
    "www.latimes.com": ".trb_ar_page",
    "www.chicagotribune.com": ".trb_ar_page",
    "www.huffpost.com": ".content-list-component",
    "www.nypost.com": ".entry-content",
    "www.nationalreview.com": ".entry-content",
    "www.theatlantic.com": ".article-body",
    "www.vice.com": ".article__body",
    "www.msnbc.com": ".article-body",
    "www.buzzfeednews.com": ".js-article-wrapper",
    "www.motherjones.com": ".article-body",
    "www.theguardian.com": ".content__article-body",
    "www.politico.com": ".story-text__paragraph",
    "www.thehill.com": ".field-item",
    "www.nationaljournal.com": ".article-body",
    "www.axios.com": ".article-content",
    "www.vox.com": ".c-entry-content",
    "www.salon.com": ".article__body",
    "www.thedailybeast.com": ".Body__Container",
    "www.dailykos.com": ".story-content",
    "www.theintercept.com": ".PostContent",
    "www.newrepublic.com": ".article-body",
    "www.motherjones.com": ".article-body",
    "www.thenation.com": ".entry-content",
    "www.slate.com": ".article__content",
    "www.jacobinmag.com": ".article__body",
    "www.theamericanconservative.com": ".entry-content",
    "www.nationalaffairs.com": ".article-content",
    "www.theamericanconservative.com": ".entry-content"
};

// get the current website
var currentWebsite = window.location.hostname;

// get the current queryselector element
var currentQuerySelector = websiteToQuerySelector[currentWebsite];


// Function to extract article text
function extractArticleText(currentQuerySelector) {
    let articleContent = '';

    // Select the article body
    const articleBody = document.querySelector(currentQuerySelector);

    console.log('Article Body:', articleBody);

    // Extract just the text from the article body

    // Check if the article body exists
    if (articleBody) {
        // Get all text nodes inside the article body
        const textNodes = articleBody.querySelectorAll('p, li'); // You can add more selectors if needed

        // Concatenate the text from each node
        textNodes.forEach(node => {
            articleContent += node.innerText + ' ';
            // console.log('Article Content:', articleContent);
        });

    }

    return articleContent;
}

// Function to send article text to OpenAI's GPT-3.5 API for classification
function classifyArticleTone(articleText) {
    const openaiApiKey = 'YOUR_OPENAI_KEY_HERE'; // Caution: Exposing API keys on the client side is a security risk

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify(
            {
                // "model": "gpt-3.5-turbo",
                "model": "gpt-3.5-turbo-1106",
                "messages": [
                  {
                    "role": "user",
                    "content": `Analyise the following news article and please give an assessment of the political tone: What is the political bias (if any), what policial themes are discussed, what might drive the author, and what hidden is the agenda being served?Make the analysis concise. Just one short sentence per question. Combine it in one paragraph and remove the headings. Highlight the most important phrases in each sentence with a '*'.\n\nHere is the news article:\n\n${articleText}`
                  }
                ],
                "temperature": 0,
                "max_tokens": 256,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
              }
        ),
    })
    .then(response => response.json())

    // .then(data => {
    //     console.log('Analysis:', data.choices[0].message.content);
    // })

    .then(data => {
        const ans = data.choices[0].message.content;
        // Create a new div element
        const div = document.createElement('div');
      
        div.innerText = ans;

        div.style.fontFamily = "Arial";
      
        div.style.color = "#333";
        div.style.padding = '20px';
        div.style.margin = '20px';
        div.style.borderRadius = '4px';
        
        div.style.width = "200px";
        div.style.background = "white";

        div.style.border = "2px solid #333";

        // Set the CSS styles for the div
        div.style.position = "fixed";
        div.style.top = "20px"; // Position 20px from the top of the page
        div.style.right = "0";
        div.style.zIndex = "9999"; // Make sure it stays on top of other elements
      
        // Add the div to the document body
        document.body.appendChild(div);
      })
      


    .catch(error => {
        console.error('Error:', error);
    });
}

// Main function to run the script
function main() {
    let articleText = extractArticleText(currentQuerySelector);

    // if article text is not empty, classify it:

    if (articleText)
        classifyArticleTone(articleText);
    else
        console.log('No article text found.');


}

// Run the main function when the page is fully loaded
if (document.readyState === 'loading') {
    // console.log('Waiting for page to load...');
    document.addEventListener('DOMContentLoaded', main);
} else {
    // console.log('Page already loaded.');
    main();
}
