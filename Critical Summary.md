# Reading List Critical Summary (Group 1)

## [1Password White Paper](https://1passwordstatic.com/files/security/1password-white-paper.pdf)

[The article](https://1passwordstatic.com/files/security/1password-white-paper.pdf) describes the design and security features of 1Password, a commercial password manager that is considered to be the most secure on the market, and describes the reasons for varying design features. 
The primary objectives of the paper are to inform users of the secure features of 1Password, allowing those users to verify the security, and cryptoanalysists and penetration testers to attempt to find potential vulnerabilities, which allows them to be disclosed and fixed quicker, minimizing the time they could be weaponized by malicious programmers. 
The article describes design features for a password manager that is well-regarded as secure, and is market-relevant to the proper design of a password manager, and thus is directly useful to the project, as it defines a project that is competing, thus giving us insight into best practices in the industry and allows us to weigh divergences against the potential to introduce vulnerabilities. 

Strengths of the article include the Secure by design features and public security model, to allow non-malicious security researchers to analyze the security features and allow users to verify the security of the design; the properly end-to-end encrypted data storage, which avoids the ability for 1Password to decrypt, either accidentally or maliciously, or to leak the decryptiond etails; the Zero-knowledge proof authentication model, which precludes an attacker eavesdropping on the authentication channel from discovering the authentication details; and the key derivation process, which allows the generation of the decryption key separate from the authentication proof.

Weaknesses of the article include the single vault key model which requires a significant decryption and reencryption step to regenerate the vault key, the secret-based zero-knowledge proof authentication mechanism, and the relatively overcomplicated sharing process that requires delivering a URL to the recipient to obtain a shared item. 

In conclusion, the article descibes a number of design features that any password manager, including our project, can learn from and consider using to ensure proper security of each user's secret data, avoiding malicious attempts to gain it both from external attackers and from the server that operates the password manager.

## [Security Analysis of Password Managers](https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-li-zhiwei.pdf)

[This article](https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-li-zhiwei.pdf) describes a security analysis of various web-based password managers, of which our project qualifies. In particular, it analyzes 5 different password managers, with varying degrees of security, and lack thereof, from the perspective of an attacker who may attempt to gain access to stored credentials from the server. This gives our project information on design features that are insufficient to properly protect user information.

Strengths of the article include thorough black box analysis of the five password managers it refers to, attempting to showcase a legitimate attack on the programs; analysis on usability and feature perspective; and a description of how vulnerabilities that were found could be patched. 

Weakenesses of the article include the limited sample set, only looking at 5 password managers; an apparant bias on LastPass, making most analysis methods in a way that seemingly favours the LastPass password manager, rather than offering a neutral overview of all relevant security aspects; and in the same vein, a limited scope of security tests that does not present all possible information on security of password managers.

In conclusion, though a significant bias towards the LastPass password manager is apparent, the paper still offers some valuable insight into design of secure password managers, particularily those which are primarily web-based. However it should not be used exclusively, and other papers on secure design should be used to fully inform any project, which our project does. 

## [Announcing the Advanced Encryption Standard](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf)

[This article](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197-upd1.pdf) describes the Advanced Encryption Standard, a symmetric key-based block cipher algorithm, based on the Rijndael algorithm, and recognized by the US National Institute of Standards and Technology as a Federal Information Processing Standard. The algorithm is intended for use as the primary symmetric cipher algorithm for both the encrypted communication tunnel and for securing items stored by the user, and thus directly relevant to the design considerations of our project.

Strengths of the article include the algorithm's resistance to a number of cryptoanalytical attacks, such as the Known Plaintext Attack and Chosen Ciphertext Attack; the variable key size, which allows applications to choose the size of input key to suit its needs witout compromising security beyond that implicated by using a smaller key size; relatively simple to implement algorithm, both in hardware and software; and the limited state required to utilise the cipher, only needing a shared secret key for encryption and decryption, and potentially any state for the block cipher mode.

Weaknesses of the article include the use of a substitution box in the cipher, for which most software implentations use a lookup table, which is vulnerable to cache-based timing attacks to discover the plaintext, and the inherent validation of decrypted plaintexts, though this weakness is overcome using a variety of techniques, notably endorsed by NIST is the Gaolis Counter Mode Block Cipher Mode of Operation, however such techniques are not directly documented or referenced in the article.

In conclusion, the Advanced Encryption Standard is a well-known and well-regarded symmetric cipher algorithm, and is most likely the algorithm of choice for our project when a symmetric cipher is required or otherwise used. 

## [Web API Verification: Results and Challenges](http://static.cs.brown.edu/~sk/Publications/Papers/Published/glpk-web-api-verif-short/paper.pdf)

[This article](http://static.cs.brown.edu/~sk/Publications/Papers/Published/glpk-web-api-verif-short/paper.pdf) describes methods for verifying a Web API provided for websites against security vulnerabilities. Browser APIs and Web APIs defined by W3C are used by our project to communicate with the server, to perform cryptographic operations on data, and to generate random keys, and thus the security of our project depends on the security of these apis. Additionally, the security of extension apis is useful for future designs expanding our project to include browser extensions.

The Strengths of the paper include an thorough analysis of the challenges of verifying Javascript APIs provided by browsers, and the use of static and dynamic type checking to ensure validity of those APIs.

The Weaknesses of the paper include a lack of description of particular attempts at verification, as examples of the process, and only some described prior work. Further, it doesn't fully articulate all of the information about the challenges in performing verification. 

In conclusion, a rigourous verification of common implementations of the APIs used by our project is likely to be useful, particularily as to cryptographic and security-related APIs, but is a significant undertaking that will likely be left to future work. 

## [UC-339 Cybersecurity Analysis of Password Managers](https://digitalcommons.kennesaw.edu/cday/Spring_2023/Undergraduate_Capstone/10/)

[This article](https://digitalcommons.kennesaw.edu/cday/Spring_2023/Undergraduate_Capstone/10/) describes further Cybersecurity Analysis on 3 different password managers. Similar to our sixth paper, it performs analytics on various password manager designs, which is useful for our project to find points of vulnerability that it is useful to avoid.

The strengths of the article include the analysis methods of the password managers, including an attempted bruteforce attack on the BitWarden password manager and a cryptanalysis attack on browser-based password stores. 

The article however has several notable weaknesses. Like the previous article, it is incredibly limited and only analyzes 3 targets. Additionally, while it attempts to attack the Firefox Browser password storage, an external factor impeded the attack, thus the results were inconclusive. No indication is given that a continued attempt was made. Further, there does not seem to be any kind of commonality between attack methods, which means the relative security of each manager is not tested. It used a brute-force attack against BitWarden and a Cryptanalysis attack against Firefox and Google Chrome. 

In conclusion, this article is severely lacking in both design and execution of the attacks it describes. Similar to the 2nd article, it provides some key information, but is not being used exclusively to determine security measures. However, it does provide some insight into potential attacks that need to addressed by our project

## [PBKDF2 NIST Publication](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)

[The article](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) addresses the problem of low entropy and poor randomness of passwords, highlighting their unsuitability for direct use as cryptographic keys. It introduces a family of password-based key derivation functions (PBKDFs) as a solution to derive better cryptographic keys from passwords. This article is relevant to our project as we are concerned with securely encrypting user data, using keys only the user knows. This means that we need a way to derive a secure encryption key from a much less secure (but memorable) password. The techniques outlined in this paper are widely used by other existing password managers.

The main idea presented in the article is to combine a user password with a salt through a key derivation function (KDF) to obtain a master key for encryption purposes. It emphasizes the importance of salt length, and recommends a minimum length of 128 bits. Additionally, instead of performing a single HMAC (Hash-based Message Authentication Code) operation on the password and salt, the authors suggest performing many iterations of HMAC, reusing the results of previous iterations.

One of the strengths of this approach is that by using a sufficient number of iteration counts, the process becomes slow, which adds an extra layer of security by slowing down potential attackers. This is desireable as it makes brute forcing the key original key infeasible. Since the security is derived from the number of iterations, this method easily scales with newer and more powerful hardware, ensuring it remains effective over time.

However, a notable weakness of the specified algorithm is that its overall security relies heavily on the use of sufficiently random inputs. If the inputs are not truly random, it could compromise the security of the derived cryptographic keys. One other weakness is that as hardware becomes more powerful, the generated key needs to become longer to prevent it from being brute forced.

In conclusion, the article addresses the limitations of using passwords as cryptographic keys and proposes a family of PBKDFs as a solution. While the method has strengths in terms of its scalability and ability to slow down attackers, its security is potentially dependent on the randomness of the inputs, which must be carefully considered during implementation.

## [Keccack Implementation Overview](https://keccak.team/files/Keccak-implementation-3.2.pdf)

[The article](https://keccak.team/files/Keccak-implementation-3.2.pdf) provides an overview of the Keccak family of algorithms, which serve as the foundation for cryptographic algorithms like SHA-3. The key ideas presented in the paper revolve around optimization methods based on software and hardware conditions. Some examples include bit interleaving, leveraging Single Instruction Multiple Data (SIMD) instructions on capable hardware, and even utilizing graphics hardware for batch computation. Our project will use secure hashing extensively, so an understanding of the workings of such algorithms is valuable.

One of the strengths of these algorithms is their sponge-like design, allowing the usage ("digestion") of inputs of any length into a fixed and configurable output length. Additionally, the Keccak algorithms are capable of fast computation speeds comparable to SHA-256. They also support constant memory usage without a feed-forward loop.

In conclusion, the article provides insights into optimizing Keccak algorithms. By focusing on optimization techniques based on software and hardware conditions, the paper provides valuable insights into accelerating these algorithms. Overall, the article offers a comprehensive exploration of the Keccak algorithm family.

## [Time-based OTP authentication via secure tunnel (TOAST): A mobile TOTP scheme using TLS seed exchange and encrypted offline keystore](https://ieeexplore.ieee.org/abstract/document/6920371)

[The article](https://ieeexplore.ieee.org/abstract/document/6920371) aims to develop a cryptographically secure authentication system as an enhancement to the current authentication scheme, which consists of a username, password, and two-factor authentication (2FA). The main idea is to improve the Time-based One-Time Password (TOTP) method by incorporating at-rest secret encryption. A TOTP "secret" is a shared value that both the client and server know, and use to generate a random number. "Time-based" refers to the code changing periodically with time.

One strength of the proposed system is that even if an attacker manages to obtain the on-disk keystore, the contents remain secure since they can only be brute-forced. This ensures the confidentiality of the stored secrets.

One minor weakness in the article is that it fails to discuss server-side security for the TOTP secret. Without additional measures, such as implementing similar at-rest encryption on the server side as on the client side, the server-side keystore remains vulnerable and can be exploited as a point of failure.

Our project will take the idea of at-rest encryption and utilize it to keep user data, such as passwords and other secret information, completely out of our hands. We would like to store as little data as possible in the cloud, particularly pieces of information which would allow user data to be decrypted. This has already been demonstrated in practice by other password managers such as 1Password.

Overall, the article presents an interesting approach to enhance the security of authentication systems by introducing at-rest secret encryption. However, the omission of server-side at-rest encryption or other secret security methods poses a security risk that we will aim to prevent.

## [Curve25519: New Diffie-Hellmen Speed Records](https://link.springer.com/chapter/10.1007/11745853_14)

[The article](https://link.springer.com/chapter/10.1007/11745853_14) introduces Curve25519 ("the algorithm"), a new high-security elliptic-curve-Diffie-Hellman (ECDH) function. The key idea is that two users can securely exchange a shared secret for cryptographic calculations, such as message encryption, by utilizing unique private keys and publicly shared public keys. This is accomplished through the Curve25519 algorithm. 

The author's software demonstrates that C25519 is not only as secure as previous ECDH implementations but also faster. The strengths of C25519 include its speed and security, with any known attack on the function being less feasible than brute-forcing the exchanged secret key. 

However, a weakness identified is that ECDH, and even Diffie-Hellman exchanges in general, are susceptible to man-in-the-middle attacks. To address this vulnerability in practice, certificates signed by trusted Certificate Authorities are used to validate that either party is who they claim to be.

Our hope is that the algorithm might help us design a secure data exchange system between our servers and client apps.

## [Persistence of Passwords in Bitwarden’s Browser Extension: Unnecessary Retention and Solutions](https://passcert-project.github.io/publication/2022/rafael-prates-thesis/2022_IST_MSc_Thesis_RafaelPrates.pdf)

[The article](https://passcert-project.github.io/publication/2022/rafael-prates-thesis/2022_IST_MSc_Thesis_RafaelPrates.pdf) focuses on the memory model of password managers, specifically targeting BitWarden, and investigates the potential vulnerabilities caused by data living longer than necessary in memory. The main research questions addressed are whether memory content vulnerabilities exist in password managers and what measures can be taken to mitigate them.

The article highlights that attackers can potentially access the contents of application memory through various attacks, such as cold-boot attacks and memory dumping attacks like HeartBleed. It emphasizes that the security of a password manager primarily relies on a strong master password, and if this password remains in memory longer than required, it increases the liklihood that it appears in a process memory dump, thus increasing security risk.

One key idea proposed is to avoid storing sensitive data as immutable strings. In most languages, this means that the data can live in memory for a very long time, as it is only cleaned up at the whims of garbage collection. Instead, the article suggests using an array buffer (or simply an "array") whenever possible, as it allows the same data to be represented while maintaining mutability. Sensitive data that is stored mutably can be zeroed out (or otherwise overwritten) once no longer needed. This removes the dependency on garbage collection cleaning up the unused values.

A notable strength of the article is its thorough testing methodology, which includes searching for a partial master password during entry. Additionally, the article presents a few application-level modifications to the browser extension to attempt to reduce long-lived data.

Overall, the article provides valuable insights into the potential memory vulnerabilities of password managers and offers practical suggestions for mitigating the identified risks. We will be keeping this article in mind while working on our memory model.
