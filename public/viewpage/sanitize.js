html = `

            <section class="product-details-area mtb-60px">
                <div class="container">
                    <div class="row">
                        <div class="col-xl-6 col-lg-6 col-md-12">
                            <div class="product-details-img product-details-tab">
                                <div class="zoompro-wrap zoompro-2">
                                    <div class="zoompro-border zoompro-span">
                                        <img class="" src="https://konectify.sgp1.digitaloceanspaces.com/<?php echo $database->fetched_drink_pic; ?>" data-zoom-image="https://konectify.sgp1.digitaloceanspaces.com/<?php echo $database->fetched_drink_pic; ?>" alt="" />
                                    </div>
                                </div>
                                <div id="gallery" class="product-dec-slider-2">
                                    <a class="active" data-image="https://konectify.sgp1.digitaloceanspaces.com/<?php echo $database->fetched_drink_pic; ?>" data-zoom-image="https://konectify.sgp1.digitaloceanspaces.com/<?php echo $database->fetched_drink_pic; ?>">
                                        <img src="https://konectify.sgp1.digitaloceanspaces.com/<?php echo $database->fetched_drink_pic; ?>" alt="" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-12">
                            <div class="product-details-content">
                                <h2><?php echo $database->fetched_drink_name; ?></h2>
                                <div class="pro-details-rating-wrap">
                                    <div class="rating-product">
                                        <i class="ion-android-star"></i>
                                        <i class="ion-android-star"></i>
                                        <i class="ion-android-star"></i>
                                        <i class="ion-android-star"></i>
                                        <i class="ion-android-star"></i>
                                    </div>
                                </div>
                                <div class="pricing-meta">
                                    <ul>
                                        <li class="old-price not-cut">Ksh <?php echo $database->fetched_drink_price; ?></li>
                                    </ul>
                                </div>
                                <div class="pro-details-size-color d-flex">
                                    <div class="pro-details-color-wrap">
                                        <span>Color</span>
                                        <div class="radio-toolbar">
                                            <ul>
                                                
                                                <?php
                                                
                                                    foreach($colors as $color) {
                                                        
                                                        $color = trim($color);
                                                
                                                ?>
                                                    <input type="radio" id="sizes_select_<?php echo $color; ?>" name="colors_select" value="<?php echo $color; ?>" >
                                                    <label for="sizes_select_<?php echo $color; ?>" style="border:1px solid <?php echo $color; ?>;"><?php echo $color; ?></label>
                                                    
                                                <? } ?>
                                                
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="pro-details-size-color d-flex">

                                    <div class="product-size radio-toolbar">
                                        <span>Size</span>
                                        <?php
                                                
                                                    foreach($sizes as $size) {
                                                        
                                                        $size = trim($size);
                                                
                                                ?>
                                                    <input type="radio" id="sizes_select_<?php echo $size; ?>" name="sizes_select" value="<?php echo $size; ?>" >
                                                    <label for="sizes_select_<?php echo $size; ?>"><?php echo $size; ?></label>
                                                    
                                                <? } ?>
                                    </div>
                                </div>
                                
                                <div class="pro-details-quality">
                                    <!--<div class="cart-plus-minus">
                                        <input class="cart-plus-minus-box" type="text" name="qtybutton" value="1" />
                                    </div>-->
                                    <div class="pro-details-cart btn-hover">
                                        <a href="#deleteDialog" id="mydel" data-delid="<?php echo $drink_id; ?>" class="openDeleteDialog btn btn-danger" data-toggle="modal"> + Add To Cart</a>
                                    </div>
                                </div>
                                
                              

                                <div class="pro-details-social-info">
                                    <span>Share</span>
                                    <div class="social-info">
                                        <ul>
                                            <li>
                                                
                                                <a href="https://www.facebook.com/sharer/sharer.php?u=https://barida.co.ke/product.php?p=<?php echo $drink_id;?>&t=<?php echo $database->fetched_drink_name; ?>" onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;" target="_blank"><i class="ion-social-facebook"></i></a>

                                            </li>
                                            <li>
                                                <a href="https://twitter.com/share?url=https://barida.co.ke/product.php?p=<?php echo $drink_id;?>&text=Buy <?php echo $database->fetched_drink_name;?> from Barida pay and pick." onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;" target="_blank" title="Share on Twitter"><i class="ion-social-twitter"></i></a>

                                            </li>
                                            <li>
                                                <a href="https://api.whatsapp.com/send?text=<?php echo "Buy this product from Barida pay and pick https://barida.co.ke/product.php?p=".$drink_id;?>"><i class="ion-social-whatsapp"></i></a>

                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- Shop details Area End -->
            <!-- product details description area start -->
            <div class="description-review-area mb-60px">
                <div class="container">
                    <div class="description-review-wrapper">
                        <div class="description-review-topbar nav">
                            <a class="active" data-toggle="tab" href="#des-details1">Description</a>
                        </div>
                       <?php echo $database->fetched_drink_desc; ?>
                    </div>
                </div>
            </div>

`;