import React, { useState, useEffect } from "react"
import styles from "./Home.module.css"
import axios from "axios"
import { AiOutlineLink } from "react-icons/ai"

const Home = () => {
  const [link, setLink] = useState("https://")
  interface ShortLink {
    short_url: string
    time: string
  }
  const [shortLinks, setShortLinks] = useState([] as ShortLink[])

  useEffect(() => {
    setShortLinks(JSON.parse(localStorage.getItem("shortLinks") || "[]"))
  }, [])

  const shortenLink = () => {
    const encodedParams = new URLSearchParams()
    encodedParams.append("url", link)

    const options = {
      method: "POST",
      url: "https://url-shortener-service.p.rapidapi.com/shorten",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "16bed1b4d4msh53cc768f87b5249p16104bjsne09574bde640",
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
        localStorage.setItem("shortLinks", JSON.stringify(shortLinks))
        setShortLinks([...shortLinks, data])
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  return (
    <>
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
              <button className={styles.clear1_button}>Star</button>
              <button className={styles.clear1_button}>Follow Me</button>
            </div>
          </div>
          <div className={styles.input_container}>
            <div className={styles.input_field_container}>
              <AiOutlineLink size={30} className={styles.input_icon} />
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
                <div className={styles.shortlink_container}>
                  <div className={styles.shortlink}>
                    <b>
                      <p className={styles.shortlink_url}>Shortened Link</p>
                    </b>
                    <b>
                      <p className={styles.visit_link}>Visit Link</p>
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
                        {/* <p className={styles.shortlink_time}>
                          {new Date(shortLink.time)
                            .toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              timeZone: "UTC",
                              timeZoneName: "short",
                            })
                            .replace("GMT", "")}
                        </p> */}
                        <a
                          href={shortLink.short_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p className={styles.visit_link}>Visit Link</p>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setShortLinks([])
                  localStorage.removeItem("shortLinks")
                }}
                className={styles.clear_button}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Home
