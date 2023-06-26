# Instructions

Please submit a critical summary, contribution, or evaluation of 200-300 words for each paper. In your summary, provide a concise overview of the key points discussed in each paper. Explain the main findings, methodologies used, and any significant insights or recommendations provided by the authors.

For those students who may not be familiar with writing critical summaries, here are some guidelines to help you:

- Start by reading each paper carefully. Identify the main objectives, research questions, or problems addressed by the authors.
- Summarize the key ideas and arguments presented in each paper. Focus on the main findings or outcomes of the research.
- Provide a brief explanation of how each paper relates to your own project. Highlight any similarities or differences between the authors' work and your own goals or objectives.
- Consider the strengths and weaknesses of each paper. Are there any limitations in the methodology or scope of the research? Are there areas that could have been explored further?
- Reflect on the significance of each paper to the broader field of study. Does it contribute new insights or offer valuable recommendations? Discuss the potential impact or implications of the findings.
- Use clear and concise language in your summaries. Avoid excessive technical jargon and ensure that your writing is accessible to readers who may not have a deep background in the subject matter.

Isaac - Odd #s
Connor - Even #s


## 1Password White Paper

[The article](https://1passwordstatic.com/files/security/1password-white-paper.pdf) describes the design and security features of 1Password, a commercial password manager that is considered to be the most secure on the market, and describes the reasons for varying design features. 
The primary objectives of the paper are to inform users of the secure features of 1Password, allowing those users to verify the security, and cryptoanalysists and penetration testers to attempt to find potential vulnerabilities, which allows them to be disclosed and fixed quicker, minimizing the time they could be weaponized by malicious programmers. 
The article describes design features for a password manager that is well-regarded s secure, and is market-relevant to the proper design of a password manager, and thus is directly useful to the project, as it defines a project that is competing, thus giving us insight into best practices in the industry and allows us to weigh divergences against the potential to introduce vulnerabilities. 

Strengths of the article include the Secure by design features and public security model, to allow non-malicious security researchers to analyze the security features and allow users to verify the security of the design; the properly end-to-end encrypted data storage, which avoids the ability for 1Password to decrypt, either accidentally or maliciously, or to leak the decryptiond etails; the Zero-knowledge proof authentication model, which precludes an attacker eavesdropping on the authentication channel from discovering the authentication details; and the key derivation process, which allows the generation of the decryption key separate from the authentication proof.

Weaknesses of the article include the single vault key model which requires a significant decryption and reencryption step to regenerate the vault key, the secret-based zero-knowledge proof authentication mechanism, and the relatively overcomplicated sharing process that requires delivering a URL to the recipient to obtain a shared item. 

In conclusion, the article descibes a number of design features that any password manager, including our project, can learn from and consider using to ensure proper security of each user's secret data, avoiding malicious attempts to gain it both from external attackers and from the server that operates the password manager.

## Security Analysis of Password Managers

[This article](https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-li-zhiwei.pdf) describes a security analysis of various web-based password managers, of which our project qualifies. In particular, it analyzes 5 different password managers, with varying degrees of security, and lack thereof, from the perspective of an attacker who may attempt to gain access to stored credentials from the server. This gives our project information on design features that are insufficient to properly protect user information.

Strengths of the article include thorough black box analysis of the five password managers it refers to, attempting to showcase a legitimate attack on the programs; analysis on usability and feature perspective; and a description of how vulnerabilities that were found could be patched. 

Weakenesses of the article include the limited sample set, only looking at 5 password managers; an apparant bias on LastPass, making most analysis methods in a way that seemingly favours the LastPass password manager, rather than offering a neutral overview of all relevant security aspects; and in the same vein, a limited scope of security tests that does not present all possible information on security of password managers.

In conclusion, though a significant bias towards the LastPass password manager is apparent, the paper still offers some valuable insight into design of secure password managers, particularily those which are primarily web-based. However it should not be used exclusively, and other papers on secure design should be used to fully inform any project, which our project does. 

## Announcing the Advanced Encryption Standard

[This article](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197-upd1.pdf) describes the Advanced Encryption Standard, a symmetric key-based block cipher algorithm, based on the Rijndael algorithm, and recognized by the US National Institute of Standards and Technology as a Federal Information Processing Standard. The algorithm is intended for use as the primary symmetric cipher algorithm for both the encrypted communication tunnel and for securing items stored by the user, and thus directly relevant to the design considerations of our project.

Strengths of the article include the algorithm's resistance to a number of cryptoanalytical attacks, such as the Known Plaintext Attack and Chosen Ciphertext Attack; the variable key size, which allows applications to choose the size of input key to suit its needs witout compromising security beyond that implicated by using a smaller key size; relatively simple to implement algorithm, both in hardware and software; and the limited state required to utilise the cipher, only needing a shared secret key for encryption and decryption, and potentially any state for the block cipher mode.

Weaknesses of the article include the use of a substitution box in the cipher, for which most software implentations use a lookup table, which is vulnerable to cache-based timing attacks to discover the plaintext, and the inherent validation of decrypted plaintexts, though this weakness is overcome using a variety of techniques, notably endorsed by NIST is the Gaolis Counter Mode Block Cipher Mode of Operation, however such techniques are not directly documented or referenced in the article.

In conclusion, the Advanced Encryption Standard is a well-known and well-regarded symmetric cipher algorithm, and is most likely the algorithm of choice for our project when a symmetric cipher is required or otherwise used. 

## Web API Verification: Results and Challenges

[This article](http://static.cs.brown.edu/~sk/Publications/Papers/Published/glpk-web-api-verif-short/paper.pdf) describes methods for verifying a Web API provided for websites against security vulnerabilities. Browser APIs and Web APIs defined by W3C are used by our project to communicate with the server, to perform cryptographic operations on data, and to generate random keys, and thus the security of our project depends on the security of these apis. Additionally, the security of extension apis is useful for future designs expanding our project to include browser extensions.

The Strengths of the paper include an thorough analysis of the challenges of verifying Javascript APIs provided by browsers, and the use of static and dynamic type checking to ensure validity of those APIs.

The Weaknesses of the paper include a lack of description of particular attempts at verification, as examples of the process, and only some described prior work. Further, it doesn't fully articulate all of the information about the challenges in performing verification. 

In conclusion, a rigourous verification of common implementations of the APIs used by our project is likely to be useful, particularily as to cryptographic and security-related APIs, but is a significant undertaking that will likely be left to future work. 

## UC-339 Cybersecurity Analysis of Password Managers

[This article](https://digitalcommons.kennesaw.edu/cday/Spring_2023/Undergraduate_Capstone/10/) describes further Cybersecurity Analysis on 3 different password managers. Similar to our sixth paper, it performs analytics on various password manager designs, which is useful for our project to find points of vulnerability that it is useful to avoid.

The strengths of the article include the analysis methods of the password managers, including an attempted bruteforce attack on the BitWarden password manager and a cryptanalysis attack on browser-based password stores. 

The article however has several notable weaknesses. Like the previous article, it is incredibly limited and only analyzes 3 targets. Additionally, while it attempts to attack the Firefox Browser password storage, an external factor impeded the attack, thus the results were inconclusive. No indication is given that a continued attempt was made. Further, there does not seem to be any kind of commonality between attack methods, which means the relative security of each manager is not tested. It used a brute-force attack against BitWarden and a Cryptanalysis attack against Firefox and Google Chrome. 

In conclusion, this article is severely lacking in both design and execution of the attacks it describes. Similar to the 6th article, it provides some key information, but is not being used exclusively to determine security measures. However, it does provide some insight into potential attacks that need to addressed by our project