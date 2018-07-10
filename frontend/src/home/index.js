import React, {Component} from 'react';

class HomeComp extends Component
{
    render()
    {
        var container = {
            width: "700px",
            height: "500px",
            position: "relative"
        };

        var headerContainer = {
            padding: "20px"
        };
         var leftCont = {
             position: "absolute",
             top: "25%",
             left: "1%",
            width: "400px",
            color: "navy",
            fontFamily: "Courier New"
        }
        var ancor = {
            color: "red"
        }

        return(
            <div style={container}>
                <div style={headerContainer}>
                    <h3>Welcome to MovieMania!</h3>
                    <hr/>
                </div>
                <div className="alignright">
                    <img src="https://media.licdn.com/dms/image/C5103AQGN6oetOrl2Dg/profile-displayphoto-shrink_200_200/0?e=1535587200&v=beta&t=jM-NNiui4NrdsIOFUHN5Xxhv6H5L2wXqzuwfXOWZXa8"/>
                    <br/>
                    <p ><a style={ancor} href="https://www.linkedin.com/in/azhar-talha-syed"><i>~Azhar Talha Syed~</i></a></p>
                </div>
                <div style={leftCont}>
                <h5 >Hello I am Azhar, the founder and developer of MovieMania. MovieMania is a clone of IMDB which is a website where
                    people can find all the data related to movies and review them. This is a single page webapp buit using
                    React.js and django-rest framework. The main agenda of building this application was to develop a full stack
                    webapp on my own and get proficient at the mentioned frameworks. Here is the link to the <a style={ancor} href="https://github.com/azhartalha/Movie-Mania">GitHub repo</a> of the website
                    walk throught the code and use the website if you are intrested. :)
                </h5>
                </div>
            </div>
        );
    }
}

export default HomeComp;