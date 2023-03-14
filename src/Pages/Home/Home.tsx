import React, { useState, useEffect } from "react"
import styles from "./Home.module.css"
import axios from "axios"
import { AiOutlineLink } from "react-icons/ai"
import confetti from "canvas-confetti"
const Home = () => {
  const [link, setLink] = useState("https://")
  const [stars, setStars] = useState(0)

  const [copyLink, setCopyLink] = useState("")

  useEffect(() => {
    axios
      .get("https://api.github.com/repos/AswinAsok/shotr")
      .then((response) => {
        // handle success
        setStars(response.data.stargazers_count)
      })
      .catch((error) => {
        // handle error
        console.log(error)
      })
  }, [])
  interface ShortLink {
    short_url: string
    time: string
  }
  const [shortLinks, setShortLinks] = useState([] as ShortLink[])

  useEffect(() => {
    console.log(localStorage.getItem("shortLinks"))
    setShortLinks(JSON.parse(localStorage.getItem("shortLinks") || "[]"))
  }, [])

  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [visible])

  useEffect(() => {
    localStorage.setItem("shortLinks", JSON.stringify(shortLinks))
  }, [shortLinks])

  const shortenLink = () => {
    const encodedParams = new URLSearchParams()
    encodedParams.append("url", link)

    const options = {
      method: "POST",
      url: "https://url-shortener-service.p.rapidapi.com/shorten",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": `${import.meta.env.VITE_RAPIDAPI_KEY}`,
        "X-RapidAPI-Host": "url-shortener-service.p.rapidapi.com",
      },
      data: encodedParams,
    }

    axios
      .request(options)
      .then(function (response) {
        const data = {
          short_url: response.data.result_url,
          time: new Date().toString(),
        }
        setShortLinks([...shortLinks, data])

        setVisible(true)
        setMessage("Link Shortened Successfully")
        setCopyLink(response.data.result_url)
        // confetti()
      })
      .catch(function (error) {
        console.error(error)
        setVisible(true)
        setMessage("Link Shortened Failed :)")
      })
  }

  return (
    <>
      {visible ? (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#534cb3",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            zIndex: "9999",
          }}
        >
          {message}
        </div>
      ) : null}
      <div className={styles.navbar}>
        <p className={styles.navbar_header}>Shotr</p>
        <p className={styles.navbar_content}>Shorten Links with Ease.</p>
      </div>
      <div className={styles.main_container}>
        <div className={styles.first_view_container}>
          <div className={styles.first_view}>
            <div className={styles.fv_texts}>
              <p className={styles.fv_heading}>Create Short Links!</p>
              <p className={styles.fv_tagline}>
                Shotr is a custom short link personalization tool that enables
                you to target, engage, and drive more customers to your shorter
                link. Get Started for Free
              </p>
            </div>
            <div className={styles.button_container}>
              <a
                href="https://github.com/AswinAsok/shotr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className={styles.clear1_button}>{stars} Star</button>
              </a>
              <a
                href="https://github.com/AswinAsok/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className={styles.clear1_button}>Follow Me</button>
              </a>
            </div>
          </div>
          <div className={styles.input_container}>
            <div className={styles.input_field_container}>
              <AiOutlineLink size={30} className={styles.input_icon} />
              {copyLink.length === 0 ? (
                <>
                  <input
                    placeholder="Enter the Link Here"
                    type="text"
                    className={styles.input_field}
                    onChange={(e) => setLink(e.target.value)}
                    value={link}
                  />
                  <button
                    onClick={() => shortenLink()}
                    className={styles.shorten_button}
                  >
                    Shorten
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className={styles.input_field}
                    value={copyLink}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(copyLink)
                      setCopyLink("")
                      setVisible(true)
                      setMessage("Link Copied Successfully")
                    }}
                    className={styles.shorten_button}
                  >
                    Copy
                  </button>
                </>
              )}
            </div>
          </div>
          {shortLinks && shortLinks.length > 0 && (
            <div className={styles.fadeIn}>
              <div className={styles.fv_texts}>
                <p className={styles.sv_heading}>Previously Created Link</p>
                <p className={styles.sv_tagline}>
                  These are links that you have previously created and shortened
                  by Shotr.
                </p>
              </div>
              <div className={styles.input_container}>
                <div className={styles.overflow}>
                  <div className={styles.shortlink_container}>
                    <div className={styles.shortlink}>
                      <b>
                        <p className={styles.shortlink_header}>
                          Shortened Link
                        </p>
                      </b>
                      <b>
                        <p className={styles.visit_link_header}>Created at</p>
                      </b>
                    </div>
                  </div>
                  <div className={styles.created_shortlink}>
                    {shortLinks.map((shortLink) => (
                      <div className={styles.shortlink_container}>
                        <div className={styles.shortlink}>
                          <p className={styles.shortlink_url}>
                            {shortLink.short_url}
                          </p>
                          <p className={styles.shortlink_time}>
                            {new Date(shortLink.time)
                              .toLocaleString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                timeZone: "GMT",
                                timeZoneName: "short",
                              })
                              .replace("GMT", "")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShortLinks([])
                  localStorage.removeItem("shortLinks")
                  setVisible(true)
                  setMessage("Memory Cleared!")
                }}
                className={styles.clear_button}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        Made by <a href="https://github.com/AswinAsok/">Aswin Asok</a> with ⚛️
      </div>
    </>
  )
}

export default Home
